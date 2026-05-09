package com.example.train_ticketing.optional;

import java.util.*;

public class SmartRouteRecommendation {

    static class Edge {
        String to;
        int travelMinutes;
        int delayMinutes;

        Edge(String to, int travelMinutes, int delayMinutes) {
            this.to = to;
            this.travelMinutes = travelMinutes;
            this.delayMinutes = delayMinutes;
        }

        int cost() {
            return travelMinutes + delayMinutes;
        }
    }

    private final Map<String, List<Edge>> graph = new HashMap<>();

    public void addConnection(String from, String to, int travelMinutes, int delayMinutes) {
        graph.putIfAbsent(from, new ArrayList<>());
        graph.get(from).add(new Edge(to, travelMinutes, delayMinutes));
    }

    public List<String> findBestRoute(String start, String destination) {
        Map<String, Integer> distance = new HashMap<>();
        Map<String, String> previous = new HashMap<>();

        PriorityQueue<String> queue = new PriorityQueue<>(
                Comparator.comparingInt(distance::get)
        );

        distance.put(start, 0);
        queue.add(start);

        while (!queue.isEmpty()) {
            String current = queue.poll();

            if (current.equals(destination)) {
                break;
            }

            for (Edge edge : graph.getOrDefault(current, new ArrayList<>())) {
                int newDistance = distance.get(current) + edge.cost();

                if (newDistance < distance.getOrDefault(edge.to, Integer.MAX_VALUE)) {
                    distance.put(edge.to, newDistance);
                    previous.put(edge.to, current);
                    queue.add(edge.to);
                }
            }
        }

        List<String> path = new ArrayList<>();
        String current = destination;

        while (current != null) {
            path.add(current);
            current = previous.get(current);
        }

        Collections.reverse(path);

        if (!path.get(0).equals(start)) {
            return Collections.emptyList();
        }

        return path;
    }

    public static void main(String[] args) {
        SmartRouteRecommendation recommender = new SmartRouteRecommendation();

        recommender.addConnection("Cluj", "Sibiu", 180, 5);
        recommender.addConnection("Sibiu", "Brasov", 120, 0);
        recommender.addConnection("Brasov", "Bucharest", 150, 10);

        recommender.addConnection("Cluj", "Oradea", 160, 0);
        recommender.addConnection("Oradea", "Bucharest", 500, 0);

        List<String> bestRoute = recommender.findBestRoute("Cluj", "Bucharest");

        System.out.println("Best route: " + bestRoute);
    }
}