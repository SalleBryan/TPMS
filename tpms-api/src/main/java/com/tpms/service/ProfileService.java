package com.tpms.service;

import java.util.Optional;
import com.tpms.model.Student;

/**
 * Manages user profiles.
 */
public interface ProfileService {
    Optional<Student> getProfile(String studentId);
    Student updateProfile(Student student);
}
