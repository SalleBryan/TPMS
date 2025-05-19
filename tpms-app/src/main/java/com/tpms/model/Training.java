package com.tpms.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Training {
    private String trainingId;
    private String title;
    private String description;
    private String trainerId;
    private String trainerName;
    private LocalDate trainingDate;
    private LocalTime trainingTime;

    public Training(String trainingId, String title, String description, String trainerId,
                    String trainerName, LocalDate trainingDate, LocalTime trainingTime) {
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
    public LocalTime getTrainingTime() {
        return trainingTime;
    }
    public void setTrainingTime(LocalTime trainingTime) {
        this.trainingTime = trainingTime;
    }

    @Override
    public String toString() {
        return "Training: \n" +
               "Training ID = " + trainingId + '\n' +
               "Title = " + title + '\n' +
               "Description = " + description + '\n' +
               "Instructor ID = " + trainerId + '\n' +
               "Instructor = " + trainerName + '\n' +
               "Date = " + trainingDate +
               ", Time=" + trainingTime +
               '\n';
    }
}