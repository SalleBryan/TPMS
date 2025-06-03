package com.tpms.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a training session in the TPMS.
 */
@Entity
@Table(name = "trainings")
public class Training {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "training_id", nullable = false, unique = true)
    private String trainingId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(name = "trainer_id", nullable = false)
    private String trainerId;

    @Column(name = "training_date", nullable = false)
    private LocalDate trainingDate;

    @Column(name = "training_time", nullable = false)
    private LocalDateTime trainingTime;

    @Column(nullable = false)
    private String venue;

    public Training() {}

    public Training(String trainingId, String title, String description,
                    String trainerId, String trainerName,
                    LocalDate trainingDate, LocalDateTime trainingTime,
                    String venue) {
        this.trainingId = trainingId;
        this.title = title;
        this.description = description;
        this.trainerId = trainerId;
        this.trainingDate = trainingDate;
        this.trainingTime = trainingTime;
        this.venue = venue;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTrainingId() { return trainingId; }
    public void setTrainingId(String trainingId) { this.trainingId = trainingId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTrainerId() { return trainerId; }
    public void setTrainerId(String trainerId) { this.trainerId = trainerId; }
    public LocalDate getTrainingDate() { return trainingDate; }
    public void setTrainingDate(LocalDate trainingDate) { this.trainingDate = trainingDate; }
    public LocalDateTime getTrainingTime() { return trainingTime; }
    public void setTrainingTime(LocalDateTime trainingTime) { this.trainingTime = trainingTime; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    @Override
    public String toString() {
        return "Training{" +
               "id=" + id +
               ", trainingId='" + trainingId + '\'' +
               ", title='" + title + '\'' +
               ", description='" + description + '\'' +
               ", trainerId='" + trainerId + '\'' +
               ", trainingDate=" + trainingDate +
               ", trainingTime=" + trainingTime +
               ", venue='" + venue + '\'' +
               '}';
    }
}
