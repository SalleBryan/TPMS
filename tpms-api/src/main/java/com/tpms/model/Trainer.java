package com.tpms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "trainers")
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trainer_id", nullable = false, unique = true)
    private String trainerId;

    @Column(name = "full_name")
    private String fullName;

    private String expertise;
    private String email;

    public Trainer() {
        // JPA requires a no-arg constructor
    }

    public Trainer(String trainerId, String fullName, String expertise, String email) {
        this.trainerId = trainerId;
        this.fullName = fullName;
        this.expertise = expertise;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setEmail(String	email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Trainer{" +
               "id=" + id +
               ", trainerId='" + trainerId + '\'' +
               ", fullName='" + fullName + '\'' +
               ", expertise='" + expertise + '\'' +
               ", email='" + email + '\'' +
               '}';
    }
}
