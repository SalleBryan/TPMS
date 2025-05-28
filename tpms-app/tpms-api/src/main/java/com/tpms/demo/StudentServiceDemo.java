package com.tpms.demo;
import com.tpms.model.Student;
import com.tpms.service.*;

public class StudentServiceDemo {
    public static void main(String[] args) {
        StudentService service = new InMemoryStudentService();

        // Add one student
        service.createStudent(new Student(
            "FE23A140", 
            "Salle Bryan", 
            "CE", 
            "hbk@gmail.com", 
            3.3));

        // try {
        //     // Attempt to update a non-existent student
        //     service.updateStudent(new Student(
        //         "FE23A140", 
        //         "Ghost", 
        //         "XX", 
        //         "ghost@none", 
        //         0.0));
        // } catch (StudentNotFoundException ex) {
        //     System.out.println("Caught exception: " + ex.getMessage());
        // } finally {
        //     System.out.println("Finished update attempt.");
        // }

        // Attempt to delete a non-existent student
        // try {
        //     service.deleteStudent("FE23A140");
        // } catch (StudentNotFoundException ex) {
        //     System.out.println("Caught exception: " + ex.getMessage());
        // } finally {
        //     System.out.println("Finished delete attempt.");
        // }

        // Get all students
        System.out.println("All students: " + service.getAllStudents());
    }
}
