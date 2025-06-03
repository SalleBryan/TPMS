package com.tpms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EnrollmentDto {
    private Long id;
    @NotBlank
    private String studentId;
    @NotBlank
    private String trainingId;
    @NotNull
    private LocalDateTime enrolledAt;

    public EnrollmentDto() {}
    public EnrollmentDto(Long id, String studentId, String trainingId, LocalDateTime enrolledAt) {
        this.id = id;
        this.studentId = studentId;
        this.trainingId = trainingId;
        this.enrolledAt = enrolledAt;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getTrainingId() { return trainingId; }
    public void setTrainingId(String trainingId) { this.trainingId = trainingId; }
    public LocalDateTime getEnrolledAt() { return enrolledAt; }
    public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }
}
