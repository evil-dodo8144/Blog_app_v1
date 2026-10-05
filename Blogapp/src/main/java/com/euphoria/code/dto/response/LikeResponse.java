package com.euphoria.code.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LikeResponse {

    private Long postId;
    private long likeCount;
    private boolean likedByCurrentUser;
}
