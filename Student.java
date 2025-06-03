package com.tpms.model;

public class Student {
    private Long id;
    private String name;
    private String email;
    private String course;
    private String university;

    // Constructors
    public Student() {}

    public Student(Long id, String name, String email, String course, String university) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.course = course;
        this.university = university;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }
}
