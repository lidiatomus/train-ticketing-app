package com.example.train_ticketing.repository;

import com.example.train_ticketing.model.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {
    List<RouteStop> findByRouteIdOrderByStopOrder(Long routeId);
    List<RouteStop> findByStationId(Long stationId);
    List<RouteStop> findByRouteId(Long routeId);

}