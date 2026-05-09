package com.example.train_ticketing.config;

import com.example.train_ticketing.model.*;
import com.example.train_ticketing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (routeRepository.count() > 0) {
            return;
        }

        Station cluj = saveStation("Cluj", 46.7712, 23.6236);
        Station oradea = saveStation("Oradea", 47.0465, 21.9189);
        Station arad = saveStation("Arad", 46.1866, 21.3123);
        Station timisoara = saveStation("Timisoara", 45.7489, 21.2087);
        Station sibiu = saveStation("Sibiu", 45.7983, 24.1256);
        Station brasov = saveStation("Brasov", 45.6579, 25.6012);
        Station bucharest = saveStation("Bucharest", 44.4268, 26.1025);
        Station constanta = saveStation("Constanta", 44.1598, 28.6348);

        if (userRepository.findByEmail("admin@test.com").isEmpty()) {
            userRepository.save(
                    User.builder()
                            .firstName("Admin")
                            .lastName("User")
                            .email("admin@test.com")
                            .password(passwordEncoder.encode("admin"))
                            .role(Role.ADMIN)
                            .build()
            );
        }

        if (userRepository.findByEmail("john@test.com").isEmpty()) {
            userRepository.save(
                    User.builder()
                            .firstName("John")
                            .lastName("Doe")
                            .email("john@test.com")
                            .password(passwordEncoder.encode("1234"))
                            .role(Role.CUSTOMER)
                            .build()
            );
        }

        Train train1 = trainRepository.save(
                Train.builder()
                        .trainNumber("IR100")
                        .capacity(100)
                        .availableSeats(100)
                        .delayMinutes(0)
                        .build()
        );

        Train train2 = trainRepository.save(
                Train.builder()
                        .trainNumber("IR200")
                        .capacity(80)
                        .availableSeats(80)
                        .delayMinutes(0)
                        .build()
        );

        Train train3 = trainRepository.save(
                Train.builder()
                        .trainNumber("IR300")
                        .capacity(120)
                        .availableSeats(120)
                        .delayMinutes(0)
                        .build()
        );

        Route route1 = routeRepository.save(
                Route.builder()
                        .routeName("Cluj - Bucharest")
                        .train(train1)
                        .build()
        );

        saveStop(route1, cluj, 1, 8, 0, 8, 10);
        saveStop(route1, sibiu, 2, 11, 0, 11, 10);
        saveStop(route1, brasov, 3, 14, 0, 14, 10);
        saveStop(route1, bucharest, 100, 17, 0, 17, 0);

        Route route2 = routeRepository.save(
                Route.builder()
                        .routeName("Cluj - Timisoara")
                        .train(train2)
                        .build()
        );

        saveStop(route2, cluj, 1, 9, 0, 9, 10);
        saveStop(route2, oradea, 2, 11, 30, 11, 40);
        saveStop(route2, arad, 3, 14, 0, 14, 10);
        saveStop(route2, timisoara, 100, 16, 0, 16, 0);

        Route route3 = routeRepository.save(
                Route.builder()
                        .routeName("Bucharest - Constanta")
                        .train(train3)
                        .build()
        );

        saveStop(route3, bucharest, 1, 18, 0, 18, 20);
        saveStop(route3, constanta, 100, 21, 0, 21, 0);

        System.out.println("COMPLEX INITIAL DATA LOADED");
    }

    private Station saveStation(String name, double latitude, double longitude) {
        return stationRepository.findByNameIgnoreCase(name)
                .orElseGet(() ->
                        stationRepository.save(
                                Station.builder()
                                        .name(name)
                                        .latitude(latitude)
                                        .longitude(longitude)
                                        .build()
                        )
                );
    }

    private void saveStop(
            Route route,
            Station station,
            int stopOrder,
            int arrivalHour,
            int arrivalMinute,
            int departureHour,
            int departureMinute
    ) {
        routeStopRepository.save(
                RouteStop.builder()
                        .route(route)
                        .station(station)
                        .stopOrder(stopOrder)
                        .arrivalTime(LocalTime.of(arrivalHour, arrivalMinute))
                        .departureTime(LocalTime.of(departureHour, departureMinute))
                        .build()
        );
    }
}