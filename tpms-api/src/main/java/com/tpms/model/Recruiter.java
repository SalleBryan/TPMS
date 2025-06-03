package com.tpms.model;

import jakarta.persistence.*;

/**
 * Represents a recruiter in the TPMS.
 */
@Entity
@Table(name = "recruiters")
public class Recruiter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recruiter_id", nullable = false, unique = true)
    private String recruiterId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String email;

    public Recruiter() {}

    public Recruiter(String recruiterId, String fullName, String company, String email) {
        this.recruiterId = recruiterId;
        this.fullName = fullName;
        this.company = company;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRecruiterId() { return recruiterId; }
    public void setRecruiterId(String recruiterId) { this.recruiterId = recruiterId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    @Override
    public String toString() {
        return "Recruiter \n" +
               "S/N: " + id + '\n' +
               "RecruiterID: " + recruiterId + '\n' +
               "Name: " + fullName + '\n' +
               "Company: " + company + '\n' +
               "Email='" + email + '\n' +
               '\n';
    }
}
