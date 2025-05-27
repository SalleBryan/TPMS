package com.tpms.service;

import com.tpms.model.Student;
import java.util.Optional;

public class ProfileServiceImpl implements ProfileService {
    private final StudentService studentService;

    public ProfileServiceImpl(StudentService studentService) {
        this.studentService = studentService;
    }

    @Override
    public Student updateProfile(Student updatedStudent) {
        try {
            return studentService.updateStudent(updatedStudent);
        } catch (RuntimeException ex) {
            throw new ProfileUpdateException(ex.getMessage());
        }
    }

    @Override
    public Optional<Student> getProfile(String studentId) {
        return studentService.getStudentById(studentId);
    }
}
