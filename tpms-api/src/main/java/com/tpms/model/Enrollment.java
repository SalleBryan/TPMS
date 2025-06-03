package com.tpms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a student's enrollment in a training session.
 */
@Entity
@Table(name = "enrollment")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "training_id", nullable = false)
    private String trainingId;

    @Column(name = "enrolled_at", nullable = false)
    private LocalDateTime enrolledAt;

    protected Enrollment() {
        // JPA requires a default constructor
    }

    public Enrollment(String studentId, String trainingId, LocalDateTime enrolledAt) {
        this.studentId = studentId;
        this.trainingId = trainingId;
        this.enrolledAt = enrolledAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getTrainingId() {
        return trainingId;
    }

    public void setTrainingId(String trainingId) {
        this.trainingId = trainingId;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    @Override
    public String toString() {
        return "Enrollment{" +
               "id=" + id +
               ", studentId='" + studentId + '\'' +
               ", trainingId='" + trainingId + '\'' +
               ", enrolledAt=" + enrolledAt +
               '}';
    }
}
