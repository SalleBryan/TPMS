package com.tpms.dto;

import jakarta.validation.constraints.NotBlank;
public class RecruiterDto {
    @NotBlank
    private String recruiterId;
    @NotBlank
    private String fullName;
    @NotBlank
    private String company;
    @NotBlank
    private String email;

    public RecruiterDto() {}

    public RecruiterDto(String recruiterId, String fullName, String company, String email) {
        this.recruiterId = recruiterId;
        this.fullName = fullName;
        this.company = company;
        this.email = email;
    }

    // Getters and setters
    public String getRecruiterId() { return recruiterId; }
    public void setRecruiterId(String recruiterId) { this.recruiterId = recruiterId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}