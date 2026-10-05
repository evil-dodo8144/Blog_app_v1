package com.euphoria.code.dto.response;

import com.euphoria.code.entity.Post;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostResponse {

    private Long id;
    private String title;
    private String slug;
    private String content;
    private AuthorInfo author;
    private long likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class AuthorInfo {
        private Long id;
        private String username;
        private String avatarUrl;
    }

    public static PostResponse from(Post post, long likeCount) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .content(post.getContent())
                .author(AuthorInfo.builder()
                        .id(post.getAuthor().getId())
                        .username(post.getAuthor().getUsername())
                        .avatarUrl(post.getAuthor().getAvatarUrl())
                        .build())
                .likeCount(likeCount)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
