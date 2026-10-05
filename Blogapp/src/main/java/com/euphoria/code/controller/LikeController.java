package com.euphoria.code.controller;

import com.euphoria.code.dto.response.ApiResponse;
import com.euphoria.code.dto.response.LikeResponse;
import com.euphoria.code.entity.User;
import com.euphoria.code.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/like")
@RequiredArgsConstructor
@CrossOrigin("*")
public class LikeController {

    private final LikeService likeService;

    /**
     * POST /api/posts/{postId}/like
     * Toggle like/unlike on a post. Requires authentication.
     * Returns the updated like count and whether the current user has liked.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LikeResponse>> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {

        LikeResponse response = likeService.toggleLike(postId, currentUser);
        String message = response.isLikedByCurrentUser() ? "Post liked" : "Post unliked";
        return ResponseEntity.ok(ApiResponse.success(message, response));
    }
}
