package com.tpms.model;

public class Trainer {
    private String trainerId;
    private String fullName;
    private String expertise;
    private String email;

    public Trainer(String trainerId, String fullName, String expertise, String email) {
        this.trainerId = trainerId;
        this.fullName = fullName;
        this.expertise = expertise;
        this.email = email;
    }

    public String getTrainerId() {
        return trainerId;
    }
    public void setTrainerId(String trainerId) {
        this.trainerId = trainerId;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getExpertise() {
        return expertise;
    }
    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Trainer{" +
               "trainerId='" + trainerId + '\'' +
               ", fullName='" + fullName + '\'' +
               ", expertise='" + expertise + '\'' +
               ", email='" + email + '\'' +
               '}';
    }
}