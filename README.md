# Train Ticketing Application

## Overview

This project is a full-stack Java train ticketing application developed using Spring Boot, React, PostgreSQL, and Docker.

The application allows customers to:

* search train routes between stations;
* book one or multiple train tickets;
* receive booking confirmation emails;
* view routes and stations.

The application also provides an administrator dashboard that allows:

* managing trains;
* managing stations;
* managing routes and intermediate stops;
* viewing bookings for trains;
* setting train delays;
* sending delay notification emails to customers.

---

# Technologies Used

## Backend

* Java 17
* Spring Boot
* Spring Data JPA
* Spring Mail
* Spring Security
* PostgreSQL
* Maven
* Hibernate
* Lombok

## Frontend

* React
* Vite
* Axios
* Bootstrap

## Other

* Docker
* Docker Compose

---

# Application Architecture

The application follows a layered architecture:

* Controllers → handle REST API requests
* Services → business logic
* Repositories → database access
* Models/Entities → database entities
* DTOs → request transfer objects

Frontend communicates with backend through REST APIs.

---

# Main Functionalities

## 1. Ticket Booking

Customers can:

* select a route;
* choose departure and arrival stations;
* select number of tickets;
* confirm booking.

### Validation Rules

The system prevents:

* overbooking;
* invalid stations;
* identical departure and arrival stations;
* invalid number of tickets.

### Booking Confirmation Email

After booking, the customer receives a confirmation email.

### Example Input

```text
Route: Cluj - Bucharest
Departure station: Cluj
Arrival station: Brasov
Number of tickets: 2
```

### Example Output

```text
Booking successful!
Confirmation email sent.
```

---

## 2. Route Search

The application can search routes between two stations.

Routes may:

* be direct;
* require a train change.

### Example Input

```text
Departure station: Cluj
Arrival station: Constanta
```

### Example Output

```text
Possible route found:
IR100: Cluj -> Bucharest
IR300: Bucharest -> Constanta
```

If no route exists:

```text
No route found between selected stations.
```

---

## 3. Train Management

Administrators can:

* add trains;
* update trains;
* delete trains;
* set delays.

### Example Input

```text
Train Number: IR500
Capacity: 120
```

### Example Output

```text
Train added successfully.
```

---

## 4. Station Management

Administrators can:

* add stations;
* update stations;
* delete stations.

Coordinates are automatically detected using a geolocation API.

### Example Input

```text
Station Name: Oradea
```

### Example Output

```text
Station added successfully.
Latitude: 47.0465
Longitude: 21.9189
```

---

## 5. Route Management

Administrators can:

* create routes;
* add intermediate stops;
* update routes;
* delete routes.

### Route Validation

The system validates:

* logical station order;
* chronological stop times;
* geographic consistency.

### Example Input

```text
Route Name: Cluj - Bucharest
Train: IR100
Start Station: Cluj
End Station: Bucharest
```

### Example Output

```text
Route created successfully.
```

---

## 6. Delay Notifications

Administrators can set delays for trains.

When a delay is added:

* all customers with bookings for that train receive an email notification.

### Example Input

```text
Train: IR100
Delay: 30 minutes
```

### Example Output

```text
Delay updated successfully.
Notification emails sent.
```

---

# Database

The application uses PostgreSQL.

Main entities:

* User
* Train
* Station
* Route
* RouteStop
* Booking

Relationships:

* One train can have multiple routes.
* One route can contain multiple stops.
* One booking belongs to one customer.
* One booking belongs to one train.

---

# Security

Passwords are encrypted using BCrypt.

The frontend protects:

* admin pages;
* booking pages.

Unauthenticated users are redirected to login.

---

# Docker Support

The application supports Docker and Docker Compose.

Containers:

* PostgreSQL
* Backend
* Frontend

---

# Running the Application

## Option 1 — Local Run

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Backend URL:

```text
http://localhost:8080
```

---

## Option 2 — Docker

Run from project root:

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080
```

---

# Environment Variables

Example `.env` file:

```env
DB_USERNAME=postgres
DB_PASSWORD=password

MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

---

# Demo Accounts

## Admin

```text
Email: admin@test.com
Password: admin123
```

## Customer

```text
Email: john@test.com
Password: 1234
```

---

# Example Routes

## Route 1

```text
Cluj -> Sibiu -> Brasov -> Bucharest
```

## Route 2

```text
Cluj -> Oradea -> Arad -> Timisoara
```

## Route 3

```text
Bucharest -> Constanta
```

---

# Future Improvements

Possible future extensions:

* JWT authentication;
* online payment integration;
* live train tracking;
* seat selection;
* PDF ticket generation;
* admin analytics dashboard.

---

# Conclusion

The project demonstrates a complete full-stack train ticketing system with:

* REST API development;
* database management;
* frontend-backend integration;
* Docker deployment;
* email notifications;
* role-based management;
* validation and business logic.

The application satisfies all requested assignment requirements.

# Optional Problem: Smart Route Recommendation

## Problem

The basic route search feature can find possible routes between two stations, but it does not decide which route is the best one.

The optional problem is to recommend the best train route between two stations by considering:
- total travel time;
- train delays;
- possible intermediate stations.

## Solution

I modelled the railway network as a weighted graph:
- each station is a node;
- each train connection is an edge;
- each edge has a cost equal to travel time plus delay.

To find the best route, I used Dijkstra’s algorithm. This algorithm finds the path with the minimum total cost between two stations.

##Implementation

The implementation is placed in:

src/main/java/com/example/train_ticketing/optional/SmartRouteRecommendation.java

Example input:

Cluj -> Sibiu, 180 minutes, 5 minutes delay  
Sibiu -> Brasov, 120 minutes, 0 minutes delay  
Brasov -> Bucharest, 150 minutes, 10 minutes delay  
Cluj -> Oradea, 160 minutes, 0 minutes delay  
Oradea -> Bucharest, 500 minutes, 0 minutes delay  

Example output:

Best route: [Cluj, Sibiu, Brasov, Bucharest]

This shows that the system chooses the route with the lowest total cost, not simply the route with the fewest stations.
