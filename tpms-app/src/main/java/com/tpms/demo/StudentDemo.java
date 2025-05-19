package com.tpms.demo;
import com.tpms.model.Student;

public class StudentDemo {
    public static void main(String[] args) {
        //1. Create a new Student object
       Student Salle = new Student(
            "FE23A140",
            "Salle Bryan",
            "CE",
            "HBK@gmail.com",
            3.8
       );

       //2. Display the student information using toString()
       System.out.println("Created Student: " + Salle);

       //3. Update a field via setter
       Salle.setCgpa(3.3);
       System.out.println("Updated CGPA: " + Salle);

       //4. Read individual fields using getters
       System.out.println("Student email is: " + Salle.getEmail());

    }
}
