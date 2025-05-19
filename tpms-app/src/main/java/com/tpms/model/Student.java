package com.tpms.model;

/**
 * Represents a student in the Training and Placement Management System.
 */
public class Student {
    private String studentId;
    private String fullName;
    private String department;
    private String email;
    private double cgpa;

    /**
     * Constructs a new Student with all required fields.
     * @param studentId unique identifier for the student
     * @param fullName  full name of the student
     * @param department department of study
     * @param email email address
     * @param cgpa cumulative grade point average
     */
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
