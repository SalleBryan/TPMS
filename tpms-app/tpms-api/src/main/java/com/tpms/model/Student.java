package com.tpms.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a student in the TPMS.
 */
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false, unique = true)
    private String studentId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String department;
    private String email;
    private double cgpa;

    // JPA requires a no-arg constructor
    protected Student() {}

    public Student(String studentId, String fullName, String department, String email, double cgpa) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.department = department;
        this.email = email;
        this.cgpa = cgpa;
    }

    // Getters and Setters
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
        return "\nStudent: \n" +
               "Matricule = " + studentId + '\n' +
               "Name = " + fullName + '\n' +
               "Department = " + department + '\n' +
               "Email = " + email + '\n' +
               "cgpa = " + cgpa + '\n';
    }
}