package com.example.train_ticketing.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int numberOfTickets;

    @ManyToOne
    private User customer;

    @ManyToOne
    private Train train;

    @ManyToOne
    private Station departureStation;

    @ManyToOne
    private Station arrivalStation;
}