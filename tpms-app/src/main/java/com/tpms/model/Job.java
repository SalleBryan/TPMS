package com.tpms.model;

public class Job {
    private String jobId;
    private String title;
    private String description;
    private String recruiterId;

    public Job(String jobId, String title, String description, String recruiterId) {
        this.jobId = jobId;
        this.title = title;
        this.description = description;
        this.recruiterId = recruiterId;
    }

    public String getJobId() {
        return jobId;
    }
    public void setJobId(String jobId) {
        this.jobId = jobId;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getRecruiterId() {
        return recruiterId;
    }
    public void setRecruiterId(String recruiterId) {
        this.recruiterId = recruiterId;
    }

    @Override
    public String toString() {
        return "Job{" +
               "jobId='" + jobId + '\'' +
               ", title='" + title + '\'' +
               ", description='" + description + '\'' +
               ", recruiterId='" + recruiterId + '\'' +
               '}';
    }
}