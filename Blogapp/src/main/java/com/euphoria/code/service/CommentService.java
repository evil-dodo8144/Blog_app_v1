package com.euphoria.code.service;

import com.euphoria.code.dto.request.CommentRequest;
import com.euphoria.code.dto.response.CommentResponse;
import com.euphoria.code.entity.Comment;
import com.euphoria.code.entity.Post;
import com.euphoria.code.entity.Role;
import com.euphoria.code.entity.User;
import com.euphoria.code.exception.ResourceNotFoundException;
import com.euphoria.code.exception.UnauthorizedException;
import com.euphoria.code.repository.CommentRepository;
import com.euphoria.code.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request, User author) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", postId));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .post(post)
                .author(author)
                .build();

        Comment saved = commentRepository.save(comment);
        return CommentResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public Page<CommentResponse> getCommentsByPost(Long postId, Pageable pageable) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post", postId);
        }
        return commentRepository.findByPostId(postId, pageable)
                .map(CommentResponse::from);
    }

    @Transactional
    public void deleteComment(Long commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        boolean isCommentAuthor = comment.getAuthor().getId().equals(currentUser.getId());
        boolean isPostAuthor    = comment.getPost().getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin         = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
            throw new UnauthorizedException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
