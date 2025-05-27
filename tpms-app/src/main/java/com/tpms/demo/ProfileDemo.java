package com.tpms.demo;

import com.tpms.service.ProfileService;
import com.tpms.service.ProfileServiceImpl;
import com.tpms.service.StudentService;
import com.tpms.service.InMemoryStudentService;
import com.tpms.model.Student;

public class ProfileDemo {
    public static void main(String[] args) {
        StudentService ss = new InMemoryStudentService();
        ProfileService ps = new ProfileServiceImpl(ss);
        // create a student
        Student s = ss.createStudent(new Student(
            "S002", 
            "Bob", 
            "EE", 
            "bob@uni.edu", 
            3.0));
        System.out.println("Before update: " + s);
        // update
        s.setFullName("Robert Smith");
        Student updated = ps.updateProfile(s);
        System.out.println("After update: " + updated);
    }
}