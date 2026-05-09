package com.example.train_ticketing.service;

import com.example.train_ticketing.dto.RouteRequest;
import com.example.train_ticketing.dto.RouteStopRequest;
import com.example.train_ticketing.dto.StationRequest;
import com.example.train_ticketing.model.*;
import com.example.train_ticketing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final BookingService bookingService;
    private final EmailService emailService;
    private final GeoCodingService geoCodingService;
    private final BookingRepository bookingRepository;

    public Train addTrain(Train train) {
        if (train.getTrainNumber() == null || train.getTrainNumber().isBlank()) {
            throw new RuntimeException("Train number is required");
        }

        if (train.getCapacity() <= 0) {
            throw new RuntimeException("Train capacity must be greater than 0");
        }

        if (train.getDelayMinutes() < 0) {
            throw new RuntimeException("Delay cannot be negative");
        }

        train.setAvailableSeats(train.getCapacity());

        return trainRepository.save(train);
    }

    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public Train updateTrain(Long id, Train updatedTrain) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));

        if (updatedTrain.getTrainNumber() == null || updatedTrain.getTrainNumber().isBlank()) {
            throw new RuntimeException("Train number is required");
        }

        if (updatedTrain.getCapacity() <= 0) {
            throw new RuntimeException("Train capacity must be greater than 0");
        }

        if (updatedTrain.getDelayMinutes() < 0) {
            throw new RuntimeException("Delay cannot be negative");
        }

        train.setTrainNumber(updatedTrain.getTrainNumber());
        train.setCapacity(updatedTrain.getCapacity());
        train.setAvailableSeats(updatedTrain.getCapacity());
        train.setDelayMinutes(updatedTrain.getDelayMinutes());

        return trainRepository.save(train);
    }

    public void deleteTrain(Long id) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));

        List<Route> routes = routeRepository.findAll()
                .stream()
                .filter(route -> route.getTrain().getId().equals(id))
                .toList();

        for (Route route : routes) {
            List<RouteStop> routeStops =
                    routeStopRepository.findByRouteIdOrderByStopOrder(route.getId());

            routeStopRepository.deleteAll(routeStops);
            routeRepository.delete(route);
        }

        bookingRepository.deleteByTrainId(id);

        trainRepository.delete(train);
    }

    public Train setDelay(Long trainId, int delayMinutes) {
        if (delayMinutes < 0) {
            throw new RuntimeException("Delay cannot be negative");
        }

        Train train = trainRepository.findById(trainId)
                .orElseThrow(() -> new RuntimeException("Train not found"));

        train.setDelayMinutes(delayMinutes);
        Train savedTrain = trainRepository.save(train);

        bookingService.getBookingsForTrain(trainId).forEach(booking ->
                emailService.sendEmail(
                        booking.getCustomer().getEmail(),
                        "Train delay notification",
                        "Train " + train.getTrainNumber()
                                + " has a delay of "
                                + delayMinutes + " minutes."
                )
        );

        return savedTrain;
    }

    public Station addStation(StationRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Station name is required");
        }

        GeoCodingService.Coordinates coordinates =
                geoCodingService.getCoordinates(request.getName());

        Station station = Station.builder()
                .name(request.getName())
                .latitude(coordinates.latitude())
                .longitude(coordinates.longitude())
                .build();

        return stationRepository.save(station);
    }

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public Station updateStation(Long id, StationRequest request) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));

        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Station name is required");
        }

        GeoCodingService.Coordinates coordinates =
                geoCodingService.getCoordinates(request.getName());

        station.setName(request.getName());
        station.setLatitude(coordinates.latitude());
        station.setLongitude(coordinates.longitude());

        return stationRepository.save(station);
    }

    public void deleteStation(Long stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));

        List<RouteStop> stationStops =
                routeStopRepository.findByStationId(stationId);

        for (RouteStop stop : stationStops) {
            Long routeId = stop.getRoute().getId();

            List<RouteStop> routeStops =
                    routeStopRepository.findByRouteIdOrderByStopOrder(routeId);

            if (routeStops.size() <= 2) {
                routeStopRepository.deleteAll(routeStops);
                routeRepository.deleteById(routeId);
            } else {
                routeStopRepository.delete(stop);

                List<RouteStop> remainingStops =
                        routeStopRepository.findByRouteIdOrderByStopOrder(routeId);

                int order = 1;

                for (RouteStop remaining : remainingStops) {
                    if (remaining.getStopOrder() == 100) {
                        continue;
                    }

                    remaining.setStopOrder(order++);
                    routeStopRepository.save(remaining);
                }
            }
        }

        stationRepository.delete(station);
    }

    public Route addRoute(RouteRequest request) {
        validateRouteRequest(request);

        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        Station startStation = stationRepository.findById(request.getStartStationId())
                .orElseThrow(() -> new RuntimeException("Start station not found"));

        Station endStation = stationRepository.findById(request.getEndStationId())
                .orElseThrow(() -> new RuntimeException("End station not found"));

        if (!hasCoordinates(startStation) || !hasCoordinates(endStation)) {
            throw new RuntimeException("Start and end stations must have coordinates");
        }

        Route route = routeRepository.save(
                Route.builder()
                        .routeName(request.getRouteName())
                        .train(train)
                        .build()
        );

        routeStopRepository.save(
                RouteStop.builder()
                        .route(route)
                        .station(startStation)
                        .stopOrder(1)
                        .arrivalTime(request.getStartDepartureTime())
                        .departureTime(request.getStartDepartureTime())
                        .build()
        );

        routeStopRepository.save(
                RouteStop.builder()
                        .route(route)
                        .station(endStation)
                        .stopOrder(100)
                        .arrivalTime(request.getEndArrivalTime())
                        .departureTime(request.getEndArrivalTime())
                        .build()
        );

        return route;
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route updateRoute(Long id, RouteRequest request) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        if (request.getRouteName() == null || request.getRouteName().isBlank()) {
            throw new RuntimeException("Route name is required");
        }

        route.setRouteName(request.getRouteName());
        route.setTrain(train);

        return routeRepository.save(route);
    }

    public void deleteRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        List<RouteStop> routeStops = routeStopRepository.findByRouteIdOrderByStopOrder(id);
        routeStopRepository.deleteAll(routeStops);

        routeRepository.delete(route);
    }

    public RouteStop addRouteStop(RouteStopRequest request) {
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Station station = stationRepository.findById(request.getStationId())
                .orElseThrow(() -> new RuntimeException("Station not found"));

        validateRouteStopRequest(request, route, station, null);

        RouteStop routeStop = RouteStop.builder()
                .route(route)
                .station(station)
                .stopOrder(request.getStopOrder())
                .arrivalTime(request.getArrivalTime())
                .departureTime(request.getDepartureTime())
                .build();

        return routeStopRepository.save(routeStop);
    }

    public List<RouteStop> getAllRouteStops() {
        return routeStopRepository.findAll();
    }

    public RouteStop updateRouteStop(Long id, RouteStopRequest request) {
        RouteStop routeStop = routeStopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route stop not found"));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Station station = stationRepository.findById(request.getStationId())
                .orElseThrow(() -> new RuntimeException("Station not found"));

        validateRouteStopRequest(request, route, station, id);

        routeStop.setRoute(route);
        routeStop.setStation(station);
        routeStop.setStopOrder(request.getStopOrder());
        routeStop.setArrivalTime(request.getArrivalTime());
        routeStop.setDepartureTime(request.getDepartureTime());

        return routeStopRepository.save(routeStop);
    }

    public void deleteRouteStop(Long id) {
        routeStopRepository.deleteById(id);
    }

    private void validateRouteRequest(RouteRequest request) {
        if (request.getRouteName() == null || request.getRouteName().isBlank()) {
            throw new RuntimeException("Route name is required");
        }

        if (request.getTrainId() == null) {
            throw new RuntimeException("Train is required");
        }

        if (request.getStartStationId() == null || request.getEndStationId() == null) {
            throw new RuntimeException("Start station and end station are required");
        }

        if (request.getStartStationId().equals(request.getEndStationId())) {
            throw new RuntimeException("Start station and end station must be different");
        }

        if (request.getStartDepartureTime() == null || request.getEndArrivalTime() == null) {
            throw new RuntimeException("Start departure time and end arrival time are required");
        }

        if (!request.getStartDepartureTime().isBefore(request.getEndArrivalTime())) {
            throw new RuntimeException("Start departure time must be before end arrival time");
        }
    }

    private void validateRouteStopRequest(
            RouteStopRequest request,
            Route route,
            Station newStation,
            Long ignoredRouteStopId
    ) {
        if (request.getRouteId() == null || request.getStationId() == null) {
            throw new RuntimeException("Route and station are required");
        }

        if (request.getStopOrder() <= 1 || request.getStopOrder() >= 100) {
            throw new RuntimeException("Intermediate stop order must be between 2 and 99");
        }

        if (request.getArrivalTime() == null || request.getDepartureTime() == null) {
            throw new RuntimeException("Arrival time and departure time are required");
        }

        if (!request.getArrivalTime().isBefore(request.getDepartureTime())) {
            throw new RuntimeException("Arrival time must be before departure time");
        }

        if (!hasCoordinates(newStation)) {
            throw new RuntimeException("Station must have coordinates");
        }

        List<RouteStop> existingStops =
                routeStopRepository.findByRouteIdOrderByStopOrder(route.getId());

        if (existingStops.size() < 2) {
            throw new RuntimeException("Route must have start and final station");
        }

        RouteStop startStop = existingStops.get(0);
        RouteStop endStop = existingStops.get(existingStops.size() - 1);

        validateGeographicStop(startStop.getStation(), endStop.getStation(), newStation);

        for (RouteStop stop : existingStops) {
            if (ignoredRouteStopId != null && stop.getId().equals(ignoredRouteStopId)) {
                continue;
            }

            if (stop.getStopOrder() == request.getStopOrder()) {
                throw new RuntimeException("A stop with this order already exists on this route");
            }

            if (stop.getStation().getId().equals(request.getStationId())) {
                throw new RuntimeException("This station already exists on this route");
            }

            if (stop.getStopOrder() < request.getStopOrder()
                    && !stop.getDepartureTime().isBefore(request.getArrivalTime())) {
                throw new RuntimeException("New stop time must be after previous stops");
            }

            if (stop.getStopOrder() > request.getStopOrder()
                    && !request.getDepartureTime().isBefore(stop.getArrivalTime())) {
                throw new RuntimeException("New stop time must be before next stops");
            }
        }
    }

    private void validateGeographicStop(Station start, Station end, Station stop) {
        if (!hasCoordinates(start) || !hasCoordinates(end) || !hasCoordinates(stop)) {
            throw new RuntimeException("All stations must have coordinates for geographic validation");
        }

        double directDistance = distanceKm(start, end);

        double distanceThroughStop =
                distanceKm(start, stop) + distanceKm(stop, end);

        if (distanceThroughStop > directDistance * 1.30) {
            throw new RuntimeException(
                    "Station " + stop.getName()
                            + " is not geographically suitable for this route"
            );
        }
    }

    private boolean hasCoordinates(Station station) {
        return station.getLatitude() != null && station.getLongitude() != null;
    }

    private double distanceKm(Station a, Station b) {
        double earthRadius = 6371.0;

        double lat1 = Math.toRadians(a.getLatitude());
        double lat2 = Math.toRadians(b.getLatitude());

        double deltaLat = Math.toRadians(b.getLatitude() - a.getLatitude());
        double deltaLon = Math.toRadians(b.getLongitude() - a.getLongitude());

        double h = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

        return earthRadius * c;
    }

    public List<RouteStop> getRouteStopsByRoute(Long routeId) {
        return routeStopRepository.findByRouteIdOrderByStopOrder(routeId);
    }
}