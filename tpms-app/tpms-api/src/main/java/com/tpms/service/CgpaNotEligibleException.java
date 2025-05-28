package com.tpms.service;

/** Thrown when a student's CGPA is below the required threshold. */
public class CgpaNotEligibleException extends RuntimeException {
    public CgpaNotEligibleException(String studentId, double actual, double required) {
        super("Student " + studentId + " has CGPA " + actual + ", below required " + required);
    }
}