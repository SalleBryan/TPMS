package com.tpms.service.impl;


import com.tpms.model.*;
import com.tpms.repository.*;
import com.tpms.service.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ProfileServiceImpl implements ProfileService {
    private final StudentRepository repo;
    public ProfileServiceImpl(StudentRepository repo) { this.repo = repo; }

    @Override public Optional<Student> getProfile(String studentId) {
        return repo.findByStudentId(studentId);
    }
    @Override public Student updateProfile(Student s) {
        Student ex = repo.findByStudentId(s.getStudentId())
            .orElseThrow(() -> new RuntimeException("Student not found"));
        s.setId(ex.getId()); return repo.save(s);
    }
}