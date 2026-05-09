package com.example.train_ticketing.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class RouteRequest {
    private String routeName;
    private Long trainId;

    private Long startStationId;
    private LocalTime startDepartureTime;

    private Long endStationId;
    private LocalTime endArrivalTime;
}