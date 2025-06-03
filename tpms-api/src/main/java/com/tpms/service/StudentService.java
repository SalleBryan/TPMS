// StudentService.java
package com.tpms.service;

import com.tpms.model.*;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing Student entities.
 */
public interface StudentService {
    Student createStudent(Student student);
    Optional<Student> getStudentById(String studentId);
    List<Student> getAllStudents();
    Student updateStudent(Student student);
    boolean deleteStudent(String studentId);
}