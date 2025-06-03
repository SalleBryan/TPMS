package com.tpms.model;

import java.time.LocalDate;

public class Training {
    private Long id;
    private String topic;
    private String description;
    private LocalDate date;

    public Training() {}

    public Training(Long id, String topic, String description, LocalDate date) {
        this.id = id;
        this.topic = topic;
        this.description = description;
        this.date = date;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
