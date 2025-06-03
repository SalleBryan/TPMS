package com.tpms.service.impl;

import com.tpms.model.*;
import com.tpms.repository.*;
import com.tpms.service.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class StudentServiceImpl implements StudentService {
    private final StudentRepository repo;
    public StudentServiceImpl(StudentRepository repo) { this.repo = repo; }

    @Override
    public Student createStudent(Student student) {
        return repo.save(student);
    }

    @Override
    public Optional<Student> getStudentById(String studentId) {
        return repo.findByStudentId(studentId);
    }

    @Override
    public List<Student> getAllStudents() {
        return repo.findAll();
    }

    @Override
    public Student updateStudent(Student student) {
        Student existing = repo.findByStudentId(student.getStudentId())
            .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setId(existing.getId());
        return repo.save(student);
    }

    @Override
    public boolean deleteStudent(String studentId) {
        Optional<Student> opt = repo.findByStudentId(studentId);
        if (opt.isPresent()) { repo.delete(opt.get()); return true; }
        return false;
    }
}
