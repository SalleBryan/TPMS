package com.tpms.model;

import jakarta.persistence.*;

/**
 * Represents a job posting in the TPMS.
 */
@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false, unique = true)
    private String jobId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(name = "recruiter_id", nullable = false)
    private String recruiterId;

    public Job() {}

    public Job(String jobId, String title, String description, String recruiterId) {
        this.jobId = jobId;
        this.title = title;
        this.description = description;
        this.recruiterId = recruiterId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRecruiterId() { return recruiterId; }
    public void setRecruiterId(String recruiterId) { this.recruiterId = recruiterId; }

    @Override
    public String toString() {
        return "Job{" +
               "id=" + id +
               ", jobId='" + jobId + '\'' +
               ", title='" + title + '\'' +
               ", description='" + description + '\'' +
               ", recruiterId='" + recruiterId + '\'' +
               '}';
    }
}
