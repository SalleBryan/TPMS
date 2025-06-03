package com.tpms.model;

public class Trainer {
    private Long id;
    private String name;
    private String expertise;
    private String email;

    public Trainer() {}

    public Trainer(Long id, String name, String expertise, String email) {
        this.id = id;
        this.name = name;
        this.expertise = expertise;
        this.email = email;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
