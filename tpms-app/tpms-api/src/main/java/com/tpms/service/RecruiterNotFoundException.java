package com.tpms.service;

public class RecruiterNotFoundException extends RuntimeException {
    public RecruiterNotFoundException(String id) {
        super("Recruiter not found: " + id);
    }
}