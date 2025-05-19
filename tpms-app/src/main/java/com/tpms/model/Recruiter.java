package com.tpms.model;

public class Recruiter {
    private String recruiterId;
    private String fullName;
    private String company;
    private String email;

    public Recruiter(String recruiterId, String fullName, String company, String email) {
        this.recruiterId = recruiterId;
        this.fullName = fullName;
        this.company = company;
        this.email = email;
    }

    public String getRecruiterId() {
        return recruiterId;
    }
    public void setRecruiterId(String recruiterId) {
        this.recruiterId = recruiterId;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getCompany() {
        return company;
    }
    public void setCompany(String company) {
        this.company = company;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Recruiter{" +
               "recruiterId='" + recruiterId + '\'' +
               ", fullName='" + fullName + '\'' +
               ", company='" + company + '\'' +
               ", email='" + email + '\'' +
               '}';
    }
}