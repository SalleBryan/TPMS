package com.tpms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a student's application to a job.
 */
@Entity
@Table(name = "application")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "job_id", nullable = false)
    private String jobId;

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    protected Application() {}

    public Application(String studentId, String jobId, LocalDateTime appliedAt) {
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