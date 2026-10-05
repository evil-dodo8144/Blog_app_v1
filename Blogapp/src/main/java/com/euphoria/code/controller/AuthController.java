package com.euphoria.code.controller;

import com.euphoria.code.dto.request.LoginRequest;
import com.euphoria.code.dto.request.RegisterRequest;
import com.euphoria.code.dto.response.ApiResponse;
import com.euphoria.code.dto.response.AuthResponse;
import com.euphoria.code.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Register a new user and return a JWT token.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("User registered successfully", authResponse));
    }

    /**
     * POST /api/auth/login
     * Authenticate an existing user and return a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }
}
