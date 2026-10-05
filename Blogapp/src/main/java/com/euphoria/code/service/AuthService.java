package com.euphoria.code.service;

import com.euphoria.code.dto.request.LoginRequest;
import com.euphoria.code.dto.request.RegisterRequest;
import com.euphoria.code.dto.response.AuthResponse;
import com.euphoria.code.dto.response.UserResponse;
import com.euphoria.code.entity.User;
import com.euphoria.code.exception.BadRequestException;
import com.euphoria.code.repository.UserRepository;
import com.euphoria.code.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);
        String token   = jwtTokenProvider.generateToken(savedUser);

        return AuthResponse.of(token, UserResponse.from(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        User user  = (User) authentication.getPrincipal();
        String jwt = jwtTokenProvider.generateToken(user);

        return AuthResponse.of(jwt, UserResponse.from(user));
    }
}
