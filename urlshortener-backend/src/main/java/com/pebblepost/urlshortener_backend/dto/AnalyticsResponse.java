package com.pebblepost.urlshortener_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AnalyticsResponse {
    private Long totalClicks;
    private List<DailyClickCount> clicksByDay;

    @Data
    @AllArgsConstructor
    public static class DailyClickCount {
        private String day;
        private Long clicks;
    }
}
