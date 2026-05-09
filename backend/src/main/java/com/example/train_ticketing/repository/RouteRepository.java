package com.example.train_ticketing.repository;

import com.example.train_ticketing.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, Long> {
}