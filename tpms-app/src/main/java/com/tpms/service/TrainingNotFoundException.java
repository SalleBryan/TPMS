package com.tpms.service;

public class TrainingNotFoundException extends RuntimeException {
    public TrainingNotFoundException(String id) {
        super("Training not found: " + id);
    }
}