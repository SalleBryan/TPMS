package com.tpms.dto;

import jakarta.validation.constraints.NotBlank;

public class TrainerDto {
    @NotBlank
    private String trainerId;
    @NotBlank
    private String fullName;
    @NotBlank
    private String expertise;
    @NotBlank
    private String email;

    public TrainerDto() {}

    public TrainerDto(String trainerId, String fullName, String expertise, String email) {
        this.trainerId = trainerId;
        this.fullName = fullName;
        this.expertise = expertise;
        this.email = email;
    }

    // Getters and setters
    public String getTrainerId() { return trainerId; }
    public void setTrainerId(String trainerId) { this.trainerId = trainerId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
