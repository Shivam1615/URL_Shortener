package com.pebblepost.urlshortener_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class LinkResponse {
    private Long id;
    private String slug;
    private String targetUrl;
    private String shortUrl;
    private LocalDateTime createdAt;
}
