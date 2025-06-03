package com.tpms.dto;

import jakarta.validation.constraints.NotBlank;

public class JobDto {
    @NotBlank
    private String jobId;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String recruiterId;

    public JobDto() {}

    public JobDto(String jobId, String title, String description, String recruiterId) {
        this.jobId = jobId;
        this.title = title;
        this.description = description;
        this.recruiterId = recruiterId;
    }

    // Getters and setters
    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRecruiterId() { return recruiterId; }
    public void setRecruiterId(String recruiterId) { this.recruiterId = recruiterId; }
}
