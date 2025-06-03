package com.tpms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for scheduling and viewing interviews.
 */
public class InterviewDto {

    private Long id;

    @NotBlank
    private String interviewId;

    @NotBlank
    private String studentId;

    @NotBlank
    private String jobId;

    @NotNull
    private LocalDateTime scheduledAt;

    public InterviewDto() {}

    public InterviewDto(Long id, String interviewId, String studentId, String jobId, LocalDateTime scheduledAt) {
        this.id = id;
        this.interviewId = interviewId;
        this.studentId = studentId;
        this.jobId = jobId;
        this.scheduledAt = scheduledAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(String interviewId) {
        this.interviewId = interviewId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public LocalDateTime getscheduledAt() {
        return scheduledAt;
    }

    public void setscheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }
}