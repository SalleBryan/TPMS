// ===== InterviewController.java =====
package com.tpms.controller;

import com.tpms.dto.InterviewDto;
import com.tpms.mapper.InterviewMapper;
import com.tpms.model.Interview;
import com.tpms.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for scheduling and retrieving interviews.
 */
@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    /**
     * Schedule a new interview.
     * Accessible by recruiters.
     */
    @PostMapping("/schedule")
    @PreAuthorize("hasRole('ROLE_RECRUITER')")
    public ResponseEntity<InterviewDto> scheduleInterview(@Valid @RequestBody InterviewDto dto) {
        Interview interview = InterviewMapper.toModel(dto);
        Interview scheduled = interviewService.scheduleInterview(interview);
        return ResponseEntity.ok(InterviewMapper.toDto(scheduled));
    }

    /**
     * Get all interviews.
     * Accessible by admin only.
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<InterviewDto>> getAllInterviews() {
        List<InterviewDto> dtos = interviewService.listAllInterviews().stream()
            .map(InterviewMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get all interviews for a given student.
     * Accessible by the student or admin.
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ROLE_STUDENT','ROLE_ADMIN')")
    public ResponseEntity<List<InterviewDto>> getInterviewsByStudent(@PathVariable String studentId) {
        List<InterviewDto> dtos = interviewService.listInterviewsByStudent(studentId).stream()
            .map(InterviewMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get all interviews for a given job.
     * Accessible by the recruiter who posted the job or admin.
     */
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('ROLE_RECRUITER','ROLE_ADMIN')")
    public ResponseEntity<List<InterviewDto>> getInterviewsByJob(@PathVariable String jobId) {
        List<InterviewDto> dtos = interviewService.listInterviewsByJob(jobId).stream()
            .map(InterviewMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
