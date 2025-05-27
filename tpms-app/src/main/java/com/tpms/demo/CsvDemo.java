package com.tpms.demo;

import com.tpms.service.CsvService;
import com.tpms.service.CsvServiceImpl;
import com.tpms.service.StudentService;
import com.tpms.service.InMemoryStudentService;
import com.tpms.model.Student;
import java.io.File;
// import java.util.Arrays;

public class CsvDemo {
    public static void main(String[] args) throws Exception {
        StudentService ss = new InMemoryStudentService();
        CsvService csv = new CsvServiceImpl(ss);
        // prepare some students
        ss.createStudent(new Student(
            "S101",
            "Alice", 
            "CE", 
            "alice@uni.edu", 
            3.0));
        ss.createStudent(new Student(
            "S102", 
            "Bob", 
            "ME", 
            "bob@uni.edu", 
            2.8));
        File file = new File("students_test.csv");
        csv.exportStudents(file);
        System.out.println("Exported to " + file.getAbsolutePath());

        // clear and import back
        ss.getAllStudents().clear();
        csv.importStudents(file);
        System.out.println("Imported students: " + ss.getAllStudents());
    }
}