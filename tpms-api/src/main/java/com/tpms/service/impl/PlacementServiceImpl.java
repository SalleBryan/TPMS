package com.tpms.service.impl;

import com.tpms.model.Application;
import com.tpms.model.Enrollment;
import com.tpms.repository.ApplicationRepository;
import com.tpms.repository.EnrollmentRepository;
import com.tpms.service.NotificationService;
import com.tpms.service.PlacementService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlacementServiceImpl implements PlacementService {
    private final EnrollmentRepository enrollmentRepo;
    private final ApplicationRepository applicationRepo;
    private final NotificationService notificationService;

    public PlacementServiceImpl(
        EnrollmentRepository enrollmentRepo,
        ApplicationRepository applicationRepo,
        NotificationService notificationService
    ) {
        this.enrollmentRepo = enrollmentRepo;
        this.applicationRepo = applicationRepo;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public void enrollInTraining(String studentId, String trainingId) {
        LocalDateTime now = LocalDateTime.now();
        Enrollment e = new Enrollment(studentId, trainingId, now);
        enrollmentRepo.save(e);
        notificationService.notifyUser(studentId, "Enrolled in training: " + trainingId);
    }

    @Override
    @Transactional
    public void applyForJob(String studentId, String jobId) {
        LocalDateTime now = LocalDateTime.now();
        Application a = new Application(studentId, jobId, now);
        applicationRepo.save(a);
        notificationService.notifyUser(studentId, "Application submitted for job: " + jobId);
    }

    @Override
    public List<com.tpms.model.Training> getTrainingsForStudent(String studentId) {
        return enrollmentRepo.findByStudentId(studentId).stream()
            .map(en -> {
                com.tpms.model.Training t = new com.tpms.model.Training();
                t.setTrainingId(en.getTrainingId());
                return t;
            }).collect(Collectors.toList());
    }

    @Override
    public List<com.tpms.model.Job> getJobsForStudent(String studentId) {
        return applicationRepo.findAll().stream()
            .filter(a -> a.getStudentId().equals(studentId))
            .map(a -> {
                com.tpms.model.Job j = new com.tpms.model.Job();
                j.setJobId(a.getJobId());
                return j;
            }).collect(Collectors.toList());
    }

    @Override
    public double calculateAverageTimeToPlacement() {
        Double avgDays = applicationRepo.findAverageTimeToPlacement();
        return avgDays != null ? avgDays : 0.0;
    }
}
