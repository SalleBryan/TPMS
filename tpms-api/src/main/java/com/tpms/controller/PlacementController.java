package com.tpms.controller;

import com.tpms.dto.JobDto;
import com.tpms.dto.TrainingDto;
import com.tpms.mapper.JobMapper;
import com.tpms.mapper.TrainingMapper;
import com.tpms.service.PlacementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for retrieving placement-related data.
 */
@RestController
@RequestMapping("/api/placement")
public class PlacementController {

    private final PlacementService placementService;

    public PlacementController(PlacementService placementService) {
        this.placementService = placementService;
    }

    /**
     * Get trainings a student is enrolled in.
     */
    @GetMapping("/trainings/{studentId}")
    @PreAuthorize("hasRole('ROLE_STUDENT') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<TrainingDto>> getTrainingsForStudent(@PathVariable String studentId) {
        List<TrainingDto> dtos = placementService.getTrainingsForStudent(studentId).stream()
            .map(TrainingMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get jobs a student has applied for.
     */
    @GetMapping("/jobs/{studentId}")
    @PreAuthorize("hasRole('ROLE_STUDENT') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<JobDto>> getJobsForStudent(@PathVariable String studentId) {
        List<JobDto> dtos = placementService.getJobsForStudent(studentId).stream()
            .map(JobMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get average time to placement across all students.
     */
    @GetMapping("/average-time")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Double> getAverageTimeToPlacement() {
        double avg = placementService.calculateAverageTimeToPlacement();
        return ResponseEntity.ok(avg);
    }
}
