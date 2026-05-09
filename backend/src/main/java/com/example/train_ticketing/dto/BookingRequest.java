package com.example.train_ticketing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequest {
    private Long customerId;
    private Long trainId;
    private Long departureStationId;
    private Long arrivalStationId;
    private int numberOfTickets;
    private Long routeId;
}