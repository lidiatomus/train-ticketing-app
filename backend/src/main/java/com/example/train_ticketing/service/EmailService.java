package com.example.train_ticketing.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendEmail(String to, String subject, String message) {
        System.out.println("=================================");
        System.out.println("EMAIL TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("MESSAGE: " + message);
        System.out.println("=================================");
    }
}