package com.tpms.controller;

import com.tpms.dto.ApplicationDto;
import com.tpms.mapper.ApplicationMapper;
import com.tpms.model.Application;
import com.tpms.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for managing job applications.
 */
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Apply for a job as a student.
     * @param dto contains studentId and jobId
     * @return the created ApplicationDto
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<ApplicationDto> applyForJob(@Valid @RequestBody ApplicationDto dto) {
        Application app = applicationService.apply(dto.getStudentId(), dto.getJobId());
        return ResponseEntity.ok(ApplicationMapper.toDto(app));
    }

    /**
     * Get all applications by a given student.
     * @param studentId ID of the student
     * @return list of ApplicationDto
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ROLE_STUDENT') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ApplicationDto>> getByStudent(@PathVariable String studentId) {
        List<ApplicationDto> dtos = applicationService.getApplicationsByStudent(studentId).stream()
            .map(ApplicationMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get all applications for a given job.
     * @param jobId ID of the job
     * @return list of ApplicationDto
     */
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ApplicationDto>> getByJob(@PathVariable String jobId) {
        List<ApplicationDto> dtos = applicationService.getApplicationsByJob(jobId).stream()
            .map(ApplicationMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * List all applications (admin only).
     * @return list of all ApplicationDto
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ApplicationDto>> getAll() {
        List<ApplicationDto> dtos = applicationService.getApplicationsByStudent("")
            .stream().map(ApplicationMapper::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
