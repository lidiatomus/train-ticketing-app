package com.example.train_ticketing.controller;

import com.example.train_ticketing.dto.DelayRequest;
import com.example.train_ticketing.dto.RouteRequest;
import com.example.train_ticketing.dto.RouteStopRequest;
import com.example.train_ticketing.dto.StationRequest;
import com.example.train_ticketing.model.*;
import com.example.train_ticketing.service.AdminService;
import com.example.train_ticketing.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin
public class AdminController {

    private final AdminService adminService;
    private final BookingService bookingService;

    @PostMapping("/trains")
    public Train addTrain(@RequestBody Train train) {
        return adminService.addTrain(train);
    }

    @GetMapping("/trains")
    public List<Train> getAllTrains() {
        return adminService.getAllTrains();
    }

    @PutMapping("/trains/{id}")
    public Train updateTrain(@PathVariable Long id, @RequestBody Train train) {
        return adminService.updateTrain(id, train);
    }

    @DeleteMapping("/trains/{id}")
    public void deleteTrain(@PathVariable Long id) {
        adminService.deleteTrain(id);
    }

    @GetMapping("/trains/{trainId}/bookings")
    public List<Booking> getBookingsForTrain(@PathVariable Long trainId) {
        return bookingService.getBookingsForTrain(trainId);
    }

    @PostMapping("/trains/{trainId}/delay")
    public Train setDelay(
            @PathVariable Long trainId,
            @RequestBody DelayRequest request
    ) {
        return adminService.setDelay(trainId, request.getDelayMinutes());
    }

    @PostMapping("/stations")
    public Station addStation(@RequestBody StationRequest request) {
        return adminService.addStation(request);
    }

    @GetMapping("/stations")
    public List<Station> getAllStations() {
        return adminService.getAllStations();
    }

    @PutMapping("/stations/{id}")
    public Station updateStation(@PathVariable Long id, @RequestBody StationRequest request) {
        return adminService.updateStation(id, request);
    }

    @DeleteMapping("/stations/{id}")
    public void deleteStation(@PathVariable Long id) {
        adminService.deleteStation(id);
    }

    @PostMapping("/routes")
    public Route addRoute(@RequestBody RouteRequest request) {
        return adminService.addRoute(request);
    }

    @GetMapping("/routes")
    public List<Route> getAllRoutes() {
        return adminService.getAllRoutes();
    }

    @PutMapping("/routes/{id}")
    public Route updateRoute(@PathVariable Long id, @RequestBody RouteRequest request) {
        return adminService.updateRoute(id, request);
    }

    @DeleteMapping("/routes/{id}")
    public void deleteRoute(@PathVariable Long id) {
        adminService.deleteRoute(id);
    }

    @PostMapping("/route-stops")
    public RouteStop addRouteStop(@RequestBody RouteStopRequest request) {
        return adminService.addRouteStop(request);
    }

    @GetMapping("/route-stops")
    public List<RouteStop> getAllRouteStops() {
        return adminService.getAllRouteStops();
    }

    @PutMapping("/route-stops/{id}")
    public RouteStop updateRouteStop(@PathVariable Long id, @RequestBody RouteStopRequest request) {
        return adminService.updateRouteStop(id, request);
    }

    @DeleteMapping("/route-stops/{id}")
    public void deleteRouteStop(@PathVariable Long id) {
        adminService.deleteRouteStop(id);
    }

    @GetMapping("/routes/{routeId}/stops")
    public List<RouteStop> getRouteStopsByRoute(@PathVariable Long routeId) {
        return adminService.getRouteStopsByRoute(routeId);
    }
}