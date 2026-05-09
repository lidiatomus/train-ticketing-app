package com.example.train_ticketing.controller;

import com.example.train_ticketing.service.RouteSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@CrossOrigin
public class RouteSearchController {

    private final RouteSearchService routeSearchService;

    @GetMapping("/search")
    public List<String> searchRoutes(
            @RequestParam String from,
            @RequestParam String to
    ) {
        return routeSearchService.searchRoutes(from, to);
    }
}