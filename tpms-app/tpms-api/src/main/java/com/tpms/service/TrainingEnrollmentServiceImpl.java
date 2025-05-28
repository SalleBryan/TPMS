package com.tpms.service;

import java.util.*;

/**
 * In-memory implementation of training enrollment logic.
 */
public class TrainingEnrollmentServiceImpl implements TrainingEnrollmentService {
    private final StudentService studentService;
    private final TrainingService trainingService;
    private final Map<String, Set<String>> enrollments = new HashMap<>();

    public TrainingEnrollmentServiceImpl(StudentService studentService,
                                         TrainingService trainingService) {
        this.studentService = studentService;
        this.trainingService = trainingService;
    }

    @Override
    public void enroll(String studentId, String trainingId) {
        // verify student exists
        studentService.getStudentById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));
        // verify training exists
        trainingService.getTrainingById(trainingId)
            .orElseThrow(() -> new TrainingNotFoundException(trainingId));
        // record enrollment
        enrollments.putIfAbsent(studentId, new HashSet<>());
        Set<String> set = enrollments.get(studentId);
        if (!set.add(trainingId)) {
            throw new DuplicateEnrollmentException(studentId, trainingId);
        }
    }

    @Override
    public Set<String> getEnrolledTrainings(String studentId) {
        return enrollments.getOrDefault(studentId, Collections.emptySet());
    }
}
