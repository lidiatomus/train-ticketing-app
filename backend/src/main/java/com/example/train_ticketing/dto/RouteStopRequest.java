package com.example.train_ticketing.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class RouteStopRequest {
    private Long routeId;
    private Long stationId;
    private int stopOrder;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
}