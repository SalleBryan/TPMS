package com.tpms.service;

public class DuplicateEnrollmentException extends RuntimeException {
    public DuplicateEnrollmentException(String studentId, String trainingId) {
        super("Student " + studentId + " already enrolled in training " + trainingId);
    }
}