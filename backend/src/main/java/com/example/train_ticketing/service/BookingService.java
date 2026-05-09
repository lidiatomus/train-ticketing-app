package com.example.train_ticketing.service;

import com.example.train_ticketing.dto.BookingRequest;
import com.example.train_ticketing.model.*;
import com.example.train_ticketing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;
    private final RouteStopRepository routeStopRepository;
    private final EmailService emailService;

    public Booking bookTicket(BookingRequest request) {
        if (request.getCustomerId() == null) {
            throw new RuntimeException("Customer is required");
        }

        if (request.getRouteId() == null) {
            throw new RuntimeException("Route is required");
        }

        if (request.getTrainId() == null) {
            throw new RuntimeException("Train is required");
        }

        if (request.getDepartureStationId() == null || request.getArrivalStationId() == null) {
            throw new RuntimeException("Departure and arrival stations are required");
        }

        if (request.getNumberOfTickets() <= 0) {
            throw new RuntimeException("Number of tickets must be greater than 0");
        }

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        Station departure = stationRepository.findById(request.getDepartureStationId())
                .orElseThrow(() -> new RuntimeException("Departure station not found"));

        Station arrival = stationRepository.findById(request.getArrivalStationId())
                .orElseThrow(() -> new RuntimeException("Arrival station not found"));

        if (departure.getId().equals(arrival.getId())) {
            throw new RuntimeException("Departure and arrival stations must be different");
        }

        List<RouteStop> stops = routeStopRepository.findByRouteIdOrderByStopOrder(request.getRouteId());

        RouteStop departureStop = stops.stream()
                .filter(stop -> stop.getStation().getId().equals(request.getDepartureStationId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Departure station is not part of this route"));

        RouteStop arrivalStop = stops.stream()
                .filter(stop -> stop.getStation().getId().equals(request.getArrivalStationId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Arrival station is not part of this route"));

        if (departureStop.getStopOrder() >= arrivalStop.getStopOrder()) {
            throw new RuntimeException("Departure station must be before arrival station on the selected route");
        }

        if (request.getNumberOfTickets() > train.getAvailableSeats()) {
            throw new RuntimeException("Not enough available seats");
        }

        Booking booking = Booking.builder()
                .customer(customer)
                .train(train)
                .departureStation(departure)
                .arrivalStation(arrival)
                .numberOfTickets(request.getNumberOfTickets())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        train.setAvailableSeats(train.getAvailableSeats() - request.getNumberOfTickets());
        trainRepository.save(train);

        emailService.sendEmail(
                customer.getEmail(),
                "Booking confirmation",
                "Your booking was confirmed for train " + train.getTrainNumber()
                        + " from " + departure.getName()
                        + " to " + arrival.getName()
                        + ". Tickets: " + request.getNumberOfTickets()
                        + ". Remaining seats: " + train.getAvailableSeats()
        );

        return savedBooking;
    }

    public List<Booking> getBookingsForTrain(Long trainId) {
        return bookingRepository.findByTrainId(trainId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}