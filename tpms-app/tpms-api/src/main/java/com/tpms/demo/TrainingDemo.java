package com.tpms.demo;

import com.tpms.model.Training;
import com.tpms.service.InMemoryTrainingService;
import com.tpms.service.TrainingService;

import java.time.LocalDateTime;

public class TrainingDemo {
    public static void main(String[] args) {
        TrainingService service = new InMemoryTrainingService();

        // Create a Training with date/time, trainer name, and venue
        Training t = new Training(
            "T001",
            "Java Basics",
            "Introductory Java course",
            "TR01",
            "Jane Doe",                                  // trainerName
            LocalDateTime.of(2025, 6, 15, 9, 30),        // dateTime: June 15, 2025 @ 09:30
            "Room 101, Tech Building"                    // venue
        );

        service.createTraining(t);
        System.out.println("Created: " + t);
    }
}
