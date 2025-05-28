package com.tpms.service;

public class TrainerNotFoundException extends RuntimeException {
    public TrainerNotFoundException(String id) {
        super("Trainer not found: " + id);
    }
}