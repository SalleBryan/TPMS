package com.tpms.demo;
import com.tpms.model.Student;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

public class StudentCollectionDemo {
    public static void main(String[] args) {
        //1. Student Objects
        Student Salle = new Student(
            "FE23A140",
            "Salle Bryan",
            "CE",
            "hbk@gmail.com",
            3.3
        );
        Student Achuo = new Student(
            "FE23A004",
            "Achuo Placid",
            "CE",
            "sircid@gmail.com",
            2.5
        );
        Student Carmen = new Student(
            "FE23A001",
            "Keukang Carmen",
            "CE",
            "kemma@gmail.com",
            3.5
        );

        //2. Create a list of Student objects
        List<Student> roster = new ArrayList<>();

        //3. Add new Student objects to the list
        roster.add(Salle);
        roster.add(Achuo); 
        roster.add(Carmen);

        //4. Convert the list to a map
        Map<String, Student> studentMap = new HashMap<>();
        for (Student student : roster) {
            studentMap.put(student.getStudentId(), student);
        }

        //5. Print Email from mapping
        System.out.println("Student Emails:");
        for (Map.Entry<String, Student> entry : studentMap.entrySet()) {
            String studentId = entry.getKey();
            Student student = entry.getValue();
            System.out.println("Matricule: " + studentId + "\nEmail: " + student.getEmail() + "\n");
        }
    }
}
