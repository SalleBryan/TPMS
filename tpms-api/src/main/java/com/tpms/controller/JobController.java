package com.tpms.controller;

import com.tpms.dto.JobDto;
import com.tpms.mapper.JobMapper;
import com.tpms.model.Job;
import com.tpms.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_RECRUITER')")
    public ResponseEntity<JobDto> createJob(@RequestBody JobDto dto) {
        Job job = JobMapper.toModel(dto);
        Job created = jobService.createJob(job);
        return ResponseEntity.ok(JobMapper.toDto(created));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STUDENT','ROLE_RECRUITER')")
    public ResponseEntity<List<JobDto>> getAllJobs() {
        List<JobDto> dtos = jobService.getAllJobs().stream()
            .map(JobMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{jobId}")
    	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STUDENT','ROLE_RECRUITER')")
    public ResponseEntity<JobDto> getJobById(@PathVariable String jobId) {
        return jobService.getJobById(jobId)
            .map(JobMapper::toDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{jobId}")
    @PreAuthorize("hasRole('ROLE_RECRUITER')")
    public ResponseEntity<JobDto> updateJob(@PathVariable String jobId,
                                            @RequestBody JobDto dto) {
        if (!jobId.equals(dto.getJobId())) {
            return ResponseEntity.badRequest().build();
        }
        Job job = JobMapper.toModel(dto);
        Job updated = jobService.updateJob(job);
        return ResponseEntity.ok(JobMapper.toDto(updated));
    }

    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasRole('ROLE_RECRUITER')")
    public ResponseEntity<Void> deleteJob(@PathVariable String jobId) {
        boolean deleted = jobService.deleteJob(jobId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
