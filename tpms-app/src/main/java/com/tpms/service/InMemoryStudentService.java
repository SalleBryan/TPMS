// InMemoryStudentService.java
package com.tpms.service;
import com.tpms.model.Student;
import java.util.*;

/**
 * In-memory implementation of StudentService for testing and demo purposes.
 */
public class InMemoryStudentService implements StudentService {
    private final Map<String, Student> students = new HashMap<>();

    @Override
    public Student createStudent(Student student) {
        students.put(student.getStudentId(), student);
        return student;
    }

    @Override
    public Optional<Student> getStudentById(String studentId) {
        return Optional.ofNullable(students.get(studentId));
    }

    @Override
    public List<Student> getAllStudents() {
        return new ArrayList<>(students.values());
    }

    @Override
    public Student updateStudent(Student student) {
        if (!students.containsKey(student.getStudentId())) {
            throw new StudentNotFoundException(student.getStudentId());
        }
        students.put(student.getStudentId(), student);
        return student;
    }

    @Override
    public boolean deleteStudent(String studentId) {
        return students.remove(studentId) != null;
    }
}
