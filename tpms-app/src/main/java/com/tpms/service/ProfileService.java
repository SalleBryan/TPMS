package com.tpms.service;

import java.util.Optional;
import com.tpms.model.Student;

/**
 * Manages user profiles.
 */
public interface ProfileService {
    Student updateProfile(Student updatedStudent);
    Optional<Student> getProfile(String studentId);
}