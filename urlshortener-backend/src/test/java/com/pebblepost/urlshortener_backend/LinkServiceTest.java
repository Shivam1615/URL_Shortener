package com.pebblepost.urlshortener_backend;

import com.pebblepost.urlshortener_backend.dto.CreateLinkRequest;
import com.pebblepost.urlshortener_backend.dto.LinkResponse;
import com.pebblepost.urlshortener_backend.model.ClickEvent;
import com.pebblepost.urlshortener_backend.model.Link;
import com.pebblepost.urlshortener_backend.repository.ClickEventRepository;
import com.pebblepost.urlshortener_backend.repository.LinkRepository;
import com.pebblepost.urlshortener_backend.service.LinkService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LinkServiceTest {

    @Mock
    private LinkRepository linkRepository;

    @Mock
    private ClickEventRepository clickEventRepository;

    @InjectMocks
    private LinkService linkService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(linkService, "baseUrl", "http://localhost:8080");
    }

    // ---- REDIRECT TESTS ----

    @Test
    void resolveSlug_validSlug_returnsTargetUrl() {
        // Arrange
        Link link = new Link();
        link.setId(1L);
        link.setSlug("abc123");
        link.setTargetUrl("https://www.google.com");
        link.setCreatedAt(LocalDateTime.now());

        when(linkRepository.findBySlug("abc123")).thenReturn(Optional.of(link));
        when(clickEventRepository.save(any(ClickEvent.class))).thenReturn(new ClickEvent());

        // Act
        String result = linkService.resolveSlug("abc123", "Mozilla/5.0");

        // Assert
        assertEquals("https://www.google.com", result);
        verify(clickEventRepository, times(1)).save(any(ClickEvent.class));
    }

    @Test
    void resolveSlug_invalidSlug_throwsException() {
        // Arrange
        when(linkRepository.findBySlug("doesnotexist")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                linkService.resolveSlug("doesnotexist", "Mozilla/5.0")
        );

        assertEquals("Link not found: doesnotexist", exception.getMessage());
        verify(clickEventRepository, never()).save(any());
    }

    // ---- DUPLICATE URL TEST ----

    @Test
    void createLink_duplicateUrl_returnsSameSlug() {
        // Arrange
        Link existing = new Link();
        existing.setId(1L);
        existing.setSlug("abc123");
        existing.setTargetUrl("https://www.google.com");
        existing.setCreatedAt(LocalDateTime.now());

        when(linkRepository.findByTargetUrl("https://www.google.com"))
                .thenReturn(Optional.of(existing));

        CreateLinkRequest request = new CreateLinkRequest();
        request.setTargetUrl("https://www.google.com");

        // Act
        LinkResponse response = linkService.createLink(request);

        // Assert
        assertEquals("abc123", response.getSlug());
        verify(linkRepository, never()).save(any());
    }
}