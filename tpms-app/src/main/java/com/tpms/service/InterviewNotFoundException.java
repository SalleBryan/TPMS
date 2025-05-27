package com.tpms.service;

public class InterviewNotFoundException extends RuntimeException {
    public InterviewNotFoundException(String id) {
        super("Interview not found: " + id);
    }
}
