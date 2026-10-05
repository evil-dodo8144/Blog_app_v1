package com.euphoria.code.service;

import com.euphoria.code.dto.response.LikeResponse;
import com.euphoria.code.entity.Post;
import com.euphoria.code.entity.PostLike;
import com.euphoria.code.entity.User;
import com.euphoria.code.exception.ResourceNotFoundException;
import com.euphoria.code.repository.PostLikeRepository;
import com.euphoria.code.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;

    /**
     * Toggle like/unlike for the given post and user.
     * Returns the updated like count and whether the current user has liked the post.
     */
    @Transactional
    public LikeResponse toggleLike(Long postId, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", postId));

        Optional<PostLike> existingLike =
                postLikeRepository.findByPostIdAndUserId(postId, currentUser.getId());

        boolean likedByCurrentUser;

        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
            likedByCurrentUser = false;
        } else {
            PostLike like = PostLike.builder()
                    .post(post)
                    .user(currentUser)
                    .build();
            postLikeRepository.save(like);
            likedByCurrentUser = true;
        }

        long newCount = postLikeRepository.countByPostId(postId);

        return LikeResponse.builder()
                .postId(postId)
                .likeCount(newCount)
                .likedByCurrentUser(likedByCurrentUser)
                .build();
    }
}
