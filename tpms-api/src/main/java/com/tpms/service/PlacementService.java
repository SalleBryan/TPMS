package com.tpms.service;

import com.tpms.model.*;
import java.util.List;

/**
 * Business operations for student placements:
 *  - apply for a job
 *  - enroll in a training
 */
public interface PlacementService {
    /**
     * Enroll a student in a training session.
     */
    void enrollInTraining(String studentId, String trainingId);

    /**
     * Apply a student for a job.
     */
    void applyForJob(String studentId, String jobId);

    /**
     * Get all training enrollments for a student.
     */
    List<Training> getTrainingsForStudent(String studentId);

    /**
     * Get all job applications for a student.
     */
    List<Job> getJobsForStudent(String studentId);

    /**
     * Calculate average time (in days) to placement across all students.
     */
    double calculateAverageTimeToPlacement();
}
