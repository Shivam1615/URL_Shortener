package com.pebblepost.urlshortener_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateLinkRequest {
    @NotBlank(message = "URL cannot be blank")
    @Pattern(
            regexp = "^https?://.*",
            message = "URL must start with http:// or https://"
    )
    private String targetUrl;
}
