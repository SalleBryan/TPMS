package com.tpms.demo;

import com.tpms.model.Trainer;
import com.tpms.service.InMemoryTrainerService;
import com.tpms.service.TrainerService;

public class TrainerDemo {
    public static void main(String[] args) {
        TrainerService service = new InMemoryTrainerService();
        Trainer tr = new Trainer("TR01", "Jane Doe", "Java", "jane.doe@training.com");
        service.createTrainer(tr);
        System.out.println("Created: " + tr);
    }
}