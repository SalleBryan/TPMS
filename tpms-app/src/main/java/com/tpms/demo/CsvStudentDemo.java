package com.tpms.demo;

import com.tpms.model.Student;
import java.io.*;
import java.util.*;

public class CsvStudentDemo {

    // Write students to CSV: id,fullName,department,email,cgpa
    public static void saveToCsv(String path, List<Student> students) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(path))) {
            for (Student s : students) {
                String line = String.join(",",
                    s.getStudentId(),
                    s.getFullName(),
                    s.getDepartment(),
                    s.getEmail(),
                    String.valueOf(s.getCgpa())
                );
                writer.write(line);
                writer.newLine();
            }
        }
    }

    // Read students from CSV, returning a list
    public static List<Student> loadFromCsv(String path) throws IOException {
        List<Student> list = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                // Parse each field
                String id = parts[0];
                String name = parts[1];
                String dept = parts[2];
                String email = parts[3];
                double cgpa = Double.parseDouble(parts[4]);
                list.add(new Student(id, name, dept, email, cgpa));
            }
        }
        return list;
    }

    public static void main(String[] args) {
        String file = "students.csv";
        List<Student> students = Arrays.asList(
            new Student("FE23A140", "Salle Bryan", "CE", "hbk@gmail.com", 3.3),
            new Student("FE23A004","Achuo Placid","CE","sircid@gmail.com",2.5)
        );

        try {
            saveToCsv(file, students);
            System.out.println("Saved to " + file);

            List<Student> loaded = loadFromCsv(file);
            System.out.println("Loaded students:");
            for (Student s : loaded) {
                System.out.println(s);
            }
        } catch (IOException e) {
            System.err.println("I/O error: " + e.getMessage());
        }
    }
}
