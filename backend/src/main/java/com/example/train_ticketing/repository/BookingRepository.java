package com.example.train_ticketing.repository;

import com.example.train_ticketing.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTrainId(Long trainId);
}