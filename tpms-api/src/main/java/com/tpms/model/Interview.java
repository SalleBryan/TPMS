package com.tpms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents an interview scheduled between a student and a job.
 */
@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "interview_id", nullable = false, unique = true)
    private String interviewId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "job_id", nullable = false)
    private String jobId;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    protected Interview() {
        // JPA
    }

    /**
     * Full constructor.
     * @param interviewId  unique interview identifier
     * @param studentId    ID of the student
     * @param jobId        ID of the job
     * @param scheduledAt         scheduled date/time
     */
    public Interview(String interviewId, String studentId, String jobId, LocalDateTime scheduledAt) {
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

    @Override
    public String toString() {
        return "Interview{" +
               "id=" + id +
               ", interviewId='" + interviewId + '\'' +
               ", studentId='" + studentId + '\'' +
               ", jobId='" + jobId + '\'' +
               ", scheduledAt=" + scheduledAt +
               '}';
    }
}
