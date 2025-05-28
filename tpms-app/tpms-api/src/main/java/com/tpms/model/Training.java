package com.tpms.model;

import java.time.LocalDateTime;

/**
 * Represents a training session.
 */
public class Training {
    private String trainingId;
    private String title;
    private String description;
    private String trainerId;
    private String trainerName;          
    private LocalDateTime dateTime;      
    private String venue;                

    public Training(String trainingId,
                    String title,
                    String description,
                    String trainerId,
                    String trainerName,
                    LocalDateTime dateTime,
                    String venue) {
        this.trainingId   = trainingId;
        this.title        = title;
        this.description  = description;
        this.trainerId    = trainerId;
        this.trainerName  = trainerName;
        this.dateTime     = dateTime;
        this.venue        = venue;
    }

    // Getters & setters for new fields

    public String getTrainerName() {
        return trainerName;
    }
    public void setTrainerName(String trainerName) {
        this.trainerName = trainerName;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }
    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getVenue() {
        return venue;
    }
    public void setVenue(String venue) {
        this.venue = venue;
    }

    // existing getters/setters...

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

    @Override
    public String toString() {
        return "Training ID = " + trainingId + '\n' +
               "Course = " + title + '\n' +
               "Description = " + description + '\n' +
               "Trainer ID='" + trainerId + '\n' +
               "Instructor = " + trainerName + '\n' +
               "Time = " + dateTime + '\n' +
               "Venue = " + venue + '\n';
    }
}
