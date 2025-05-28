package com.tpms.service;

import java.util.Set;

/**
 * Service dedicated to training enrollment logic.
 */
public interface TrainingEnrollmentService {
    /**
     * Enroll a student in a training session.
     */
    void enroll(String studentId, String trainingId);

    /**
     * Retrieve set of trainingIds the student is enrolled in.
     */
    Set<String> getEnrolledTrainings(String studentId);
}