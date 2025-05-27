package com.tpms.service;

import com.tpms.model.Student;
import java.io.*;

public class CsvServiceImpl implements CsvService {
    private final StudentService studentService;

    public CsvServiceImpl(StudentService studentService) {
        this.studentService = studentService;
    }

    @Override
    public void importStudents(File csvFile) {
        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                studentService.createStudent(new Student(
                    parts[0], parts[1], parts[2], parts[3], Double.parseDouble(parts[4])
                ));
            }
        } catch (IOException | RuntimeException ex) {
            throw new DataParseException("Failed to import students", ex);
        }
    }

    @Override
    public void exportStudents(File csvFile) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(csvFile))) {
            for (Student s : studentService.getAllStudents()) {
                writer.write(String.join(",",
                    s.getStudentId(), s.getFullName(), s.getDepartment(), s.getEmail(), String.valueOf(s.getCgpa())
                ));
                writer.newLine();
            }
        } catch (IOException ex) {
            throw new ExportFailedException("Failed to export students", ex);
        }
    }
}
