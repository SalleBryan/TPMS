package com.tpms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TrainingDto {
    @NotBlank
    private String trainingId;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String trainerId;
    @NotBlank
    private String trainerName;
    @NotNull
    private LocalDate trainingDate;
    @NotNull
    private LocalDateTime trainingTime;
    @NotBlank
    private String venue;

    public TrainingDto() {}

    public TrainingDto(String trainingId, String title, String description,
                       String trainerId, String trainerName,
                       LocalDate trainingDate, LocalDateTime trainingTime, String venue) {
        this.trainingId = trainingId;
        this.title = title;
        this.description = description;
        this.trainerId = trainerId;
        this.trainerName = trainerName;
        this.trainingDate = trainingDate;
        this.trainingTime = trainingTime;
        this.venue = venue;
    }

    // Getters and setters
    public String getTrainingId() { return trainingId; }
    public void setTrainingId(String trainingId) { this.trainingId = trainingId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTrainerId() { return trainerId; }
    public void setTrainerId(String trainerId) { this.trainerId = trainerId; }
    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }
    public LocalDate getTrainingDate() { return trainingDate; }
    public void setTrainingDate(LocalDate trainingDate) { this.trainingDate = trainingDate; }
    public LocalDateTime getTrainingTime() { return trainingTime; }
    public void setTrainingTime(LocalDateTime trainingTime) { this.trainingTime = trainingTime; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
}
