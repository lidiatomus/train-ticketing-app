package com.example.train_ticketing.repository;

import com.example.train_ticketing.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainRepository extends JpaRepository<Train, Long> {
}