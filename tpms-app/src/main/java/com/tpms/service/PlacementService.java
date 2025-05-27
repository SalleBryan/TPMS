package com.tpms.service;

import com.tpms.model.Student;
import java.util.*;

/**
 * Handles placement logic: applying for jobs and enrolling in trainings.
 */
public class PlacementService {
    private final StudentService studentService;
    private final JobService jobService;
    private final TrainingService trainingService;

    // track applications and enrollments
    private final Map<String, Set<String>> jobApplications = new HashMap<>();
    private final Map<String, Set<String>> trainingEnrollments = new HashMap<>();

    // default CGPA threshold
    private double minCgpaForPlacement = 2.5;

    public PlacementService(StudentService studentService,
                            JobService jobService,
                            TrainingService trainingService) {
        this.studentService = studentService;
        this.jobService = jobService;
        this.trainingService = trainingService;
    }

    /**
     * Student applies for a job if eligible and not already applied.
     */
    public void applyForJob(String studentId, String jobId) {
        Student student = studentService.getStudentById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));
        if (student.getCgpa() < minCgpaForPlacement) {
            throw new CgpaNotEligibleException(studentId, student.getCgpa(), minCgpaForPlacement);
        }
        // ensure job exists
        jobService.getJobById(jobId)
            .orElseThrow(() -> new JobNotFoundException(jobId));

        // track applications
        jobApplications.putIfAbsent(studentId, new HashSet<>());
        Set<String> applied = jobApplications.get(studentId);
        if (!applied.add(jobId)) {
            throw new DuplicateApplicationException(studentId, jobId);
        }
    }

    /**
     * Student enrolls in training if not already enrolled.
     */
    public void enrollInTraining(String studentId, String trainingId) {
        // verify student and training
        studentService.getStudentById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));
        trainingService.getTrainingById(trainingId)
            .orElseThrow(() -> new TrainingNotFoundException(trainingId));

        trainingEnrollments.putIfAbsent(studentId, new HashSet<>());
        Set<String> enrolled = trainingEnrollments.get(studentId);
        if (!enrolled.add(trainingId)) {
            throw new DuplicateEnrollmentException(studentId, trainingId);
        }
    }

    // getters for testing and reporting
    public Set<String> getAppliedJobs(String studentId) {
        return jobApplications.getOrDefault(studentId, Collections.emptySet());
    }
    public Set<String> getEnrolledTrainings(String studentId) {
        return trainingEnrollments.getOrDefault(studentId, Collections.emptySet());
    }

    public void setMinCgpaForPlacement(double threshold) {
        this.minCgpaForPlacement = threshold;
    }
}