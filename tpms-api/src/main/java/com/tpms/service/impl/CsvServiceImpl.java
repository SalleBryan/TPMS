package com.tpms.service.impl;

import com.tpms.model.*;
import com.tpms.repository.*;
import com.tpms.service.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Service
public class CsvServiceImpl implements CsvService {
    private final StudentRepository repo;
    public CsvServiceImpl(StudentRepository repo) { this.repo = repo; }

    @Override
    @Transactional
    public void importStudents(byte[] csvData) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ByteArrayInputStream(csvData), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length >= 5) {
                    Student s = new Student(parts[0], parts[1], parts[2], parts[3], Double.parseDouble(parts[4]));
                    repo.save(s);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to import CSV", e);
        }
    }

    @Override
    public byte[] exportStudents() {
        StringBuilder sb = new StringBuilder();
        repo.findAll().forEach(s -> sb.append(String.join(",",
            s.getStudentId(), s.getFullName(), s.getDepartment(), s.getEmail(), String.valueOf(s.getCgpa())))
            .append("\n"));
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }
}