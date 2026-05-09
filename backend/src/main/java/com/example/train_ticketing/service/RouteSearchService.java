package com.example.train_ticketing.service;

import com.example.train_ticketing.model.Route;
import com.example.train_ticketing.model.RouteStop;
import com.example.train_ticketing.repository.RouteRepository;
import com.example.train_ticketing.repository.RouteStopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteSearchService {

    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;

    public List<String> searchRoutes(String from, String to) {
        List<String> results = new ArrayList<>();
        List<Route> routes = routeRepository.findAll();

        for (Route route : routes) {
            List<RouteStop> stops = routeStopRepository.findByRouteIdOrderByStopOrder(route.getId());

            RouteStop departure = findStop(stops, from);
            RouteStop arrival = findStop(stops, to);

            if (departure != null && arrival != null &&
                    departure.getStopOrder() < arrival.getStopOrder()) {

                results.add(
                        "Direct route: Train " + route.getTrain().getTrainNumber()
                                + " | Route: " + route.getRouteName()
                                + " | From: " + from + " at " + departure.getDepartureTime()
                                + " | To: " + to + " at " + arrival.getArrivalTime()
                );
            }
        }

        for (Route firstRoute : routes) {
            List<RouteStop> firstStops = routeStopRepository.findByRouteIdOrderByStopOrder(firstRoute.getId());
            RouteStop firstDeparture = findStop(firstStops, from);

            if (firstDeparture == null) {
                continue;
            }

            for (RouteStop changeStopFirstRoute : firstStops) {
                if (changeStopFirstRoute.getStopOrder() <= firstDeparture.getStopOrder()) {
                    continue;
                }

                String changeStationName = changeStopFirstRoute.getStation().getName();

                for (Route secondRoute : routes) {
                    if (firstRoute.getId().equals(secondRoute.getId())) {
                        continue;
                    }

                    List<RouteStop> secondStops = routeStopRepository.findByRouteIdOrderByStopOrder(secondRoute.getId());

                    RouteStop secondDeparture = findStop(secondStops, changeStationName);
                    RouteStop finalArrival = findStop(secondStops, to);

                    if (secondDeparture != null && finalArrival != null &&
                            secondDeparture.getStopOrder() < finalArrival.getStopOrder()) {

                        results.add(
                                "Route with changeover: Train "
                                        + firstRoute.getTrain().getTrainNumber()
                                        + " from " + from + " at " + firstDeparture.getDepartureTime()
                                        + " to " + changeStationName + " at " + changeStopFirstRoute.getArrivalTime()
                                        + " | Change at " + changeStationName
                                        + " | Train " + secondRoute.getTrain().getTrainNumber()
                                        + " from " + changeStationName + " at " + secondDeparture.getDepartureTime()
                                        + " to " + to + " at " + finalArrival.getArrivalTime()
                        );
                    }
                }
            }
        }

        if (results.isEmpty()) {
            results.add("No possible route found between " + from + " and " + to);
        }

        return results;
    }

    private RouteStop findStop(List<RouteStop> stops, String stationName) {
        return stops.stream()
                .filter(stop -> stop.getStation().getName().equalsIgnoreCase(stationName))
                .findFirst()
                .orElse(null);
    }
}