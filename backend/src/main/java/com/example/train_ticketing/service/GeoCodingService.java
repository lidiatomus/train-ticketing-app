package com.example.train_ticketing.service;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GeoCodingService {

    private final RestClient restClient;

    public GeoCodingService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://nominatim.openstreetmap.org")
                .defaultHeader("User-Agent", "train-ticketing-app/1.0")
                .build();
    }

    public Coordinates getCoordinates(String cityName) {
        try {
            List<Map<String, Object>> response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("q", cityName + ", Romania")
                            .queryParam("format", "json")
                            .queryParam("limit", 1)
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});

            if (response == null || response.isEmpty()) {
                throw new RuntimeException("Could not find coordinates for station: " + cityName);
            }

            Map<String, Object> firstResult = response.get(0);

            double latitude = Double.parseDouble(firstResult.get("lat").toString());
            double longitude = Double.parseDouble(firstResult.get("lon").toString());

            return new Coordinates(latitude, longitude);

        } catch (Exception e) {
            throw new RuntimeException("Geocoding failed for station: " + cityName);
        }
    }

    public record Coordinates(double latitude, double longitude) {
    }
}