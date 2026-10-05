package com.euphoria.code.dto.response;

import com.euphoria.code.entity.Comment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {

    private Long id;
    private String content;
    private AuthorInfo author;
    private Long postId;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class AuthorInfo {
        private Long id;
        private String username;
        private String avatarUrl;
    }

    public static CommentResponse from(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(AuthorInfo.builder()
                        .id(comment.getAuthor().getId())
                        .username(comment.getAuthor().getUsername())
                        .avatarUrl(comment.getAuthor().getAvatarUrl())
                        .build())
                .postId(comment.getPost().getId())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
