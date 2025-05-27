package com.tpms.service;

/** Thrown when a student tries to apply or enroll twice. */
public class DuplicateApplicationException extends RuntimeException {
    public DuplicateApplicationException(String studentId, String jobId) {
        super("Student " + studentId + " already applied to job " + jobId);
    }
}