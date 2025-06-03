package com.tpms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
public class StudentDto {
    @NotBlank
    private String studentId;
    @NotBlank
    private String fullName;
    @NotBlank
    private String department;
    @NotBlank
    private String email;
    @NotNull
    private Double cgpa;

    public StudentDto() {}

    public StudentDto(String studentId, String fullName, String department, String email, Double cgpa) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.department = department;
        this.email = email;
        this.cgpa = cgpa;
    }

    // Getters and setters
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
}