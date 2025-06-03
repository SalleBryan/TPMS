package com.tpms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for student job applications.
 */
public class ApplicationDto {
    private Long id;

    @NotBlank
    private String studentId;

    @NotBlank
    private String jobId;

    @NotNull
    private LocalDateTime appliedAt;

    public ApplicationDto() {}

    public ApplicationDto(Long id, String studentId, String jobId, LocalDateTime appliedAt) {
        this.id = id;
        this.studentId = studentId;
        this.jobId = jobId;
        this.appliedAt = appliedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
