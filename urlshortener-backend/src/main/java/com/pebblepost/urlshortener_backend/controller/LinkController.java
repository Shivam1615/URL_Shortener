package com.pebblepost.urlshortener_backend.controller;

import com.pebblepost.urlshortener_backend.dto.AnalyticsResponse;
import com.pebblepost.urlshortener_backend.dto.CreateLinkRequest;
import com.pebblepost.urlshortener_backend.dto.LinkResponse;
import com.pebblepost.urlshortener_backend.service.LinkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LinkController {

    private final LinkService linkService;

    // Create a short link
    @PostMapping("/api/v1/links")
    public ResponseEntity<LinkResponse> createLink(@Valid @RequestBody CreateLinkRequest request) {
        LinkResponse response = linkService.createLink(request);
        return ResponseEntity.created(URI.create("/api/v1/links/" + response.getId())).body(response);
    }

    // Get all links
    @GetMapping("/api/v1/links")
    public ResponseEntity<List<LinkResponse>> getAllLinks() {
        return ResponseEntity.ok(linkService.getAllLinks());
    }

    // Redirect by slug
    @GetMapping("/{slug}")
    public ResponseEntity<Void> redirect(@PathVariable String slug,
                                         @RequestHeader(value = "User-Agent", defaultValue = "") String userAgent) {
        String targetUrl = linkService.resolveSlug(slug, userAgent);
        return ResponseEntity.status(302).location(URI.create(targetUrl)).build();
    }

    // Get analytics for a link
    @GetMapping("/api/v1/links/{id}/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(linkService.getAnalytics(id));
    }
}