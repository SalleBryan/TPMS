package com.tpms.controller;

import com.tpms.dto.EnrollmentDto;
import com.tpms.mapper.EnrollmentMapper;
import com.tpms.model.Enrollment;
import com.tpms.repository.EnrollmentRepository;
import com.tpms.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for enrolling students in training sessions.
 */
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepo;
    private final NotificationService notificationService;

    public EnrollmentController(EnrollmentRepository enrollmentRepo,
                                NotificationService notificationService) {
        this.enrollmentRepo = enrollmentRepo;
        this.notificationService = notificationService;
    }

    /**
     * Enroll a student in a training.
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<EnrollmentDto> enroll(@Valid @RequestBody EnrollmentDto dto) {
        Enrollment e = new Enrollment(
            dto.getStudentId(),
            dto.getTrainingId(),
            dto.getEnrolledAt() != null ? dto.getEnrolledAt() : LocalDateTime.now()
        );
        Enrollment saved = enrollmentRepo.save(e);
        notificationService.notifyUser(saved.getStudentId(),
            "Enrolled in training: " + saved.getTrainingId());
        return ResponseEntity.ok(EnrollmentMapper.toDto(saved));
    }

    /**
     * List all enrollments for a student.
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ROLE_STUDENT') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<EnrollmentDto>> getByStudent(@PathVariable String studentId) {
        List<EnrollmentDto> dtos = enrollmentRepo.findByStudentId(studentId).stream()
            .map(EnrollmentMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * List all enrollments for a training.
     */
    @GetMapping("/training/{trainingId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_TRAINER')")
    public ResponseEntity<List<EnrollmentDto>> getByTraining(@PathVariable String trainingId) {
        List<EnrollmentDto> dtos = enrollmentRepo.findByTrainingId(trainingId).stream()
            .map(EnrollmentMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * List all enrollments (admin only).
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<EnrollmentDto>> getAll() {
        List<EnrollmentDto> dtos = enrollmentRepo.findAll().stream()
            .map(EnrollmentMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}