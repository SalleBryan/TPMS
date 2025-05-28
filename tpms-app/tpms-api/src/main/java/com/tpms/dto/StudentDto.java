package com.tpms.dto;
/**
 * DTO for Student data in API requests/responses.
 */
public class StudentDto {
    private String studentId;
    private String fullName;
    private String department;
    private String email;
    private double cgpa;

    public StudentDto() {
        // Default constructor for serialization
    }

    public StudentDto(String studentId, String fullName, String department, String email, double cgpa) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.department = department;
        this.email = email;
        this.cgpa = cgpa;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getCgpa() {
        return cgpa;
    }

    public void setCgpa(double cgpa) {
        this.cgpa = cgpa;
    }

    @Override
    public String toString() {
        return "StudentDto{" +
               "studentId='" + studentId + '\'' +
               ", fullName='" + fullName + '\'' +
               ", department='" + department + '\'' +
               ", email='" + email + '\'' +
               ", cgpa=" + cgpa +
               '}';
    }
}