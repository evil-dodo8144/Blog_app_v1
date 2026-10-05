package com.euphoria.code.controller;

import com.euphoria.code.dto.request.UpdateProfileRequest;
import com.euphoria.code.dto.response.ApiResponse;
import com.euphoria.code.dto.response.UserResponse;
import com.euphoria.code.entity.User;
import com.euphoria.code.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    /**
     * GET /api/users/me
     * Get the authenticated user's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(
            @AuthenticationPrincipal User currentUser) {

        UserResponse profile = userService.getProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    /**
     * PUT /api/users/me
     * Update the authenticated user's profile.
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateProfileRequest request) {

        UserResponse updated = userService.updateProfile(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    /**
     * GET /api/users/{id}
     * Get any user's public profile by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved", user));
    }
}
