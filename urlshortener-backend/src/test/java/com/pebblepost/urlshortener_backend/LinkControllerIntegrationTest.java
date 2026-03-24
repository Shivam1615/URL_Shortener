package com.pebblepost.urlshortener_backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pebblepost.urlshortener_backend.model.Link;
import com.pebblepost.urlshortener_backend.repository.ClickEventRepository;
import com.pebblepost.urlshortener_backend.repository.LinkRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class LinkControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private LinkRepository linkRepository;

    @Autowired
    private ClickEventRepository clickEventRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        clickEventRepository.deleteAll();
        linkRepository.deleteAll();
    }

    // ---- PRIMARY WORKFLOW ----

    @Test
    void createLink_validUrl_returns201() throws Exception {
        Map<String, String> request = Map.of("targetUrl", "https://www.google.com");

        mockMvc.perform(post("/api/v1/links")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").isNotEmpty())
                .andExpect(jsonPath("$.shortUrl").isNotEmpty())
                .andExpect(jsonPath("$.targetUrl").value("https://www.google.com"));
    }

    @Test
    void redirect_validSlug_returns302() throws Exception {
        // Create a link first
        Link link = new Link();
        link.setSlug("test01");
        link.setTargetUrl("https://www.google.com");
        linkRepository.save(link);

        mockMvc.perform(get("/test01")
                        .header("User-Agent", "Mozilla/5.0"))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "https://www.google.com"));
    }

    // ---- FAILURE MODES ----

    @Test
    void createLink_invalidUrl_returns400() throws Exception {
        Map<String, String> request = Map.of("targetUrl", "not-a-valid-url");

        mockMvc.perform(post("/api/v1/links")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.targetUrl")
                        .value("URL must start with http:// or https://"));
    }

    @Test
    void redirect_unknownSlug_returns404() throws Exception {
        mockMvc.perform(get("/doesnotexist"))
                .andExpect(status().isNotFound());
    }

    @Test
    void redirect_recordsClickEvent() throws Exception {
        // Create a link
        Link link = new Link();
        link.setSlug("test02");
        link.setTargetUrl("https://www.github.com");
        linkRepository.save(link);

        // Redirect
        mockMvc.perform(get("/test02")
                        .header("User-Agent", "Mozilla/5.0"))
                .andExpect(status().isFound());

        // Verify click was recorded
        long clickCount = clickEventRepository.countByLinkId(link.getId());
        assert clickCount == 1;
    }
}