package com.example.train_ticketing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DelayRequest {
    private int delayMinutes;
}