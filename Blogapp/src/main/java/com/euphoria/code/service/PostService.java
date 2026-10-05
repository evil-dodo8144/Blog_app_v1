package com.euphoria.code.service;

import com.euphoria.code.dto.request.PostRequest;
import com.euphoria.code.dto.response.PostResponse;
import com.euphoria.code.entity.Post;
import com.euphoria.code.entity.Role;
import com.euphoria.code.entity.User;
import com.euphoria.code.exception.ResourceNotFoundException;
import com.euphoria.code.exception.UnauthorizedException;
import com.euphoria.code.repository.PostLikeRepository;
import com.euphoria.code.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PostService {

    private static final Pattern NONLATIN   = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;

    // ── CRUD ─────────────────────────────────────────────────────────────────

    @Transactional
    public PostResponse createPost(PostRequest request, User author) {
        String slug = generateUniqueSlug(request.getTitle());

        Post post = Post.builder()
                .title(request.getTitle())
                .slug(slug)
                .content(request.getContent())
                .author(author)
                .build();

        Post saved = postRepository.save(post);
        return PostResponse.from(saved, 0L);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(post -> PostResponse.from(post, postLikeRepository.countByPostId(post.getId())));
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(Long id) {
        Post post = findPost(id);
        return PostResponse.from(post, postLikeRepository.countByPostId(id));
    }

    @Transactional(readOnly = true)
    public PostResponse getPostBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with slug: " + slug));
        return PostResponse.from(post, postLikeRepository.countByPostId(post.getId()));
    }

    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request, User currentUser) {
        Post post = findPost(postId);
        assertAuthorOrAdmin(post, currentUser);

        // Only regenerate slug if the title changed
        if (!post.getTitle().equals(request.getTitle())) {
            post.setSlug(generateUniqueSlug(request.getTitle()));
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());

        Post updated = postRepository.save(post);
        return PostResponse.from(updated, postLikeRepository.countByPostId(postId));
    }

    @Transactional
    public void deletePost(Long postId, User currentUser) {
        Post post = findPost(postId);
        assertAuthorOrAdmin(post, currentUser);
        postRepository.delete(post);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Post findPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", id));
    }

    private void assertAuthorOrAdmin(Post post, User user) {
        boolean isAuthor = post.getAuthor().getId().equals(user.getId());
        boolean isAdmin  = user.getRole() == Role.ROLE_ADMIN;
        if (!isAuthor && !isAdmin) {
            throw new UnauthorizedException("You are not allowed to modify this post");
        }
    }

    /**
     * Generates a URL-friendly slug from a title.
     * Appends a numeric suffix if the slug already exists.
     */
    private String generateUniqueSlug(String title) {
        String baseSlug = toSlug(title);
        String slug     = baseSlug;
        int    counter  = 1;
        while (postRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }

    private String toSlug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String noLatinExtra = NONLATIN.matcher(normalized).replaceAll("");
        String noWhitespace = WHITESPACE.matcher(noLatinExtra).replaceAll("-");
        return noWhitespace.toLowerCase(Locale.ENGLISH).replaceAll("-{2,}", "-");
    }
}
