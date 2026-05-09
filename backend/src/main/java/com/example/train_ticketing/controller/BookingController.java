package com.example.train_ticketing.controller;

import com.example.train_ticketing.dto.BookingRequest;
import com.example.train_ticketing.model.Booking;
import com.example.train_ticketing.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public Booking bookTicket(@RequestBody BookingRequest request) {
        return bookingService.bookTicket(request);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/train/{trainId}")
    public List<Booking> getBookingsForTrain(@PathVariable Long trainId) {
        return bookingService.getBookingsForTrain(trainId);
    }
}