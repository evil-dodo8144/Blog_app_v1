package com.euphoria.code.service;

import com.euphoria.code.dto.request.UpdateProfileRequest;
import com.euphoria.code.dto.response.UserResponse;
import com.euphoria.code.entity.User;
import com.euphoria.code.exception.BadRequestException;
import com.euphoria.code.exception.ResourceNotFoundException;
import com.euphoria.code.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getProfile(User currentUser) {
        return UserResponse.from(currentUser);
    }

    @Transactional
    public UserResponse updateProfile(User currentUser, UpdateProfileRequest request) {
        // Validate new username uniqueness if being changed
        if (StringUtils.hasText(request.getUsername())
                && !request.getUsername().equals(currentUser.getUsername())) {

            if (userRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException(
                        "Username '" + request.getUsername() + "' is already taken");
            }
            currentUser.setUsername(request.getUsername());
        }

        if (request.getBio() != null) {
            currentUser.setBio(request.getBio());
        }

        if (request.getAvatarUrl() != null) {
            currentUser.setAvatarUrl(request.getAvatarUrl());
        }

        User updated = userRepository.save(currentUser);
        return UserResponse.from(updated);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return UserResponse.from(user);
    }
}
