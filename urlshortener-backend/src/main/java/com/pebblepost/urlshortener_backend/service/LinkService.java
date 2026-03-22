package com.pebblepost.urlshortener_backend.service;

import com.pebblepost.urlshortener_backend.dto.AnalyticsResponse;
import com.pebblepost.urlshortener_backend.dto.CreateLinkRequest;
import com.pebblepost.urlshortener_backend.dto.LinkResponse;
import com.pebblepost.urlshortener_backend.model.ClickEvent;
import com.pebblepost.urlshortener_backend.model.Link;
import com.pebblepost.urlshortener_backend.repository.ClickEventRepository;
import com.pebblepost.urlshortener_backend.repository.LinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class LinkService {

    private final LinkRepository linkRepository;
    private final ClickEventRepository clickEventRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int SLUG_LENGTH = 6;

    // Create a short link or return existing one if URL already exists
    @Transactional
    public LinkResponse createLink(CreateLinkRequest request) {
        // Check if URL already exists - same URL = same slug
        Optional<Link> existing = linkRepository.findByTargetUrl(request.getTargetUrl());
        if (existing.isPresent()) {
            return toResponse(existing.get());
        }

        // Generate a unique slug
        String slug = generateUniqueSlug();

        Link link = new Link();
        link.setSlug(slug);
        link.setTargetUrl(request.getTargetUrl());

        Link saved = linkRepository.save(link);
        return toResponse(saved);
    }

    // Redirect - find link by slug and record click event
    @Transactional
    public String resolveSlug(String slug, String userAgent) {
        Link link = linkRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Link not found: " + slug));

        ClickEvent clickEvent = new ClickEvent();
        clickEvent.setLink(link);
        clickEvent.setUserAgent(userAgent);
        clickEventRepository.save(clickEvent);

        return link.getTargetUrl();
    }

    // Get all links
    public List<LinkResponse> getAllLinks() {
        return linkRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Analytics - total clicks and clicks by day
    public AnalyticsResponse getAnalytics(Long linkId) {
        linkRepository.findById(linkId)
                .orElseThrow(() -> new RuntimeException("Link not found: " + linkId));

        Long totalClicks = clickEventRepository.countByLinkId(linkId);

        List<Object[]> rows = clickEventRepository.findClicksGroupedByDay(linkId);
        List<AnalyticsResponse.DailyClickCount> clicksByDay = rows.stream()
                .map(row -> new AnalyticsResponse.DailyClickCount(
                        row[0].toString(),
                        ((Number) row[1]).longValue()
                ))
                .toList();

        return new AnalyticsResponse(totalClicks, clicksByDay);
    }

    // Generate a random unique slug
    private String generateUniqueSlug() {
        Random random = new Random();
        String slug;
        do {
            StringBuilder sb = new StringBuilder(SLUG_LENGTH);
            for (int i = 0; i < SLUG_LENGTH; i++) {
                sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
            }
            slug = sb.toString();
        } while (linkRepository.findBySlug(slug).isPresent());
        return slug;
    }

    // Map Link entity to LinkResponse DTO
    private LinkResponse toResponse(Link link) {
        return new LinkResponse(
                link.getId(),
                link.getSlug(),
                link.getTargetUrl(),
                baseUrl + "/" + link.getSlug(),
                link.getCreatedAt()
        );
    }
}