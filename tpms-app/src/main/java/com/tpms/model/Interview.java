package com.tpms.model;

import java.time.LocalDateTime;

/**
 * Represents a scheduled interview.
 */
public class Interview {
    private String interviewId;
    private String studentId;
    private String jobId;
    private LocalDateTime when;

    public Interview(String interviewId, String studentId, String jobId, LocalDateTime when) {
        this.interviewId = interviewId;
        this.studentId = studentId;
        this.jobId = jobId;
        this.when = when;
    }

    public String getInterviewId() {
        return interviewId;
    }
    public String getStudentId() {
        return studentId;
    }
    public String getJobId() {
        return jobId;
    }
    public LocalDateTime getWhen() {
        return when;
    }
    public void setWhen(LocalDateTime when) {
        this.when = when;
    }

    @Override
    public String toString() {
        return "Interview{" +
               "interviewId='" + interviewId + '\'' +
               ", Student Matricule='" + studentId + '\'' +
               ", jobId='" + jobId + '\'' +
               ", when=" + when +
               '}';
    }
}