package com.euphoria.code.controller;

import com.euphoria.code.dto.request.PostRequest;
import com.euphoria.code.dto.response.ApiResponse;
import com.euphoria.code.dto.response.PostResponse;
import com.euphoria.code.entity.User;
import com.euphoria.code.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PostController {

    private final PostService postService;

    /**
     * GET /api/posts?page=0&size=10&sort=createdAt,desc
     * Get paginated list of all posts. Public endpoint.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PostResponse> posts = postService.getAllPosts(pageable);

        return ResponseEntity.ok(ApiResponse.success("Posts retrieved", posts));
    }

    /**
     * GET /api/posts/{id}
     * Get a single post by ID. Public endpoint.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPostById(@PathVariable Long id) {
        PostResponse post = postService.getPostById(id);
        return ResponseEntity.ok(ApiResponse.success("Post retrieved", post));
    }

    /**
     * GET /api/posts/slug/{slug}
     * Get a single post by slug. Public endpoint.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<PostResponse>> getPostBySlug(@PathVariable String slug) {
        PostResponse post = postService.getPostBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Post retrieved", post));
    }

    /**
     * POST /api/posts
     * Create a new post. Requires authentication.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal User currentUser) {

        PostResponse post = postService.createPost(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Post created successfully", post));
    }

    /**
     * PUT /api/posts/{id}
     * Update a post. Only the author or an admin may update.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal User currentUser) {

        PostResponse post = postService.updatePost(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Post updated successfully", post));
    }

    /**
     * DELETE /api/posts/{id}
     * Delete a post. Only the author or an admin may delete.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        postService.deletePost(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully", null));
    }
}
