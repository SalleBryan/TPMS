package com.tpms.demo;
import java.util.ArrayList;
import java.util.List;
import com.tpms.model.Student;

public class StudentListDemo {
    public static void main(String[] args) {
        //1. Create a list of Student objects
        List<Student> roster = new ArrayList<>();

        //2. Add new Student objects to the list
        roster.add(
          new Student (
            "FE23A140",
            "Salle Bryan",
            "CE",
            "hbk@gmail.com",
            3.3
          )
        );
        roster.add(
          new Student (
            "FE23A004",
            "Achuo Placid",
            "CE",
            "sircid@gmail.com",
            2.5
          )
        );

        //3. Iterate Through the list
        System.out.println("Student Roster:");
        for (Student student : roster) {
            System.out.println("Student " + (roster.indexOf(student) + 1) + ":");
            System.out.println("Matricule: " + student.getStudentId());
            System.out.println("Full Name: " + student.getFullName());
            System.out.println("Department: " + student.getDepartment());
            System.out.println("Email: " + student.getEmail());
            System.out.println("CGPA: " + student.getCgpa());
            System.out.println("\n");
        }

        //4. Access by index
        Student firstStudent = roster.get(0);
        System.out.println("First Student Matricule: " + firstStudent.getStudentId());
        System.out.println("First Student Name: " + firstStudent.getFullName());
    }
}
