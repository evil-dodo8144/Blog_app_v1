package com.euphoria.code.controller;

import com.euphoria.code.dto.request.CommentRequest;
import com.euphoria.code.dto.response.ApiResponse;
import com.euphoria.code.dto.response.CommentResponse;
import com.euphoria.code.entity.User;
import com.euphoria.code.service.CommentService;
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
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CommentController {

    private final CommentService commentService;

    /**
     * POST /api/posts/{postId}/comments
     * Add a comment to a post. Requires authentication.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser) {

        CommentResponse comment = commentService.addComment(postId, request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Comment added", comment));
    }

    /**
     * GET /api/posts/{postId}/comments?page=0&size=20
     * Get paginated comments for a post. Public endpoint.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CommentResponse> comments = commentService.getCommentsByPost(postId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Comments retrieved", comments));
    }

    /**
     * DELETE /api/posts/{postId}/comments/{commentId}
     * Delete a comment. Comment author, post author, or admin may delete.
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal User currentUser) {

        commentService.deleteComment(commentId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted", null));
    }
}
