package com.tpms.service;

public class JobNotFoundException extends RuntimeException {
    public JobNotFoundException(String id) {
        super("Job not found: " + id);
    }
}