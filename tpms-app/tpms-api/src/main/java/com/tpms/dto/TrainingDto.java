package com.tpms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Training data in API requests/responses.
 */
public class TrainingDto {
    private String trainingId;
    private String title;
    private String description;
    private String trainerId;
    private String trainerName;
    private LocalDate trainingDate;
    private LocalDateTime trainingTime;

    public TrainingDto() {
        // Default constructor for serialization
    }

    public TrainingDto(String trainingId, String title, String description,
                       String trainerId, String trainerName,
                       LocalDate trainingDate, LocalDateTime trainingTime) {
        this.trainingId = trainingId;
        this.title = title;
        this.description = description;
        this.trainerId = trainerId;
        this.trainerName = trainerName;
        this.trainingDate = trainingDate;
        this.trainingTime = trainingTime;
    }

    public String getTrainingId() {
        return trainingId;
    }

    public void setTrainingId(String trainingId) {
        this.trainingId = trainingId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(String trainerId) {
        this.trainerId = trainerId;
    }

    public String getTrainerName() {
        return trainerName;
    }

    public void setTrainerName(String trainerName) {
        this.trainerName = trainerName;
    }

    public LocalDate getTrainingDate() {
        return trainingDate;
    }

    public void setTrainingDate(LocalDate trainingDate) {
        this.trainingDate = trainingDate;
    }

    public LocalDateTime getTrainingTime() {
        return trainingTime;
    }

    public void setTrainingTime(LocalDateTime trainingTime) {
        this.trainingTime = trainingTime;
    }

    @Override
    public String toString() {
        return "TrainingDto{" +
               "trainingId='" + trainingId + '\'' +
               ", title='" + title + '\'' +
               ", description='" + description + '\'' +
               ", trainerId='" + trainerId + '\'' +
               ", trainerName='" + trainerName + '\'' +
               ", trainingDate=" + trainingDate +
               ", trainingTime=" + trainingTime +
               '}';
    }
}