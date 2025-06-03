package com.tpms.controller;

import com.tpms.dto.StudentDto;
import com.tpms.mapper.StudentMapper;
import com.tpms.model.Student;
import com.tpms.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<StudentDto> createStudent(@RequestBody StudentDto dto) {
        Student student = StudentMapper.toModel(dto);
        Student created = studentService.createStudent(student);
        return ResponseEntity.ok(StudentMapper.toDto(created));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        List<StudentDto> dtos = studentService.getAllStudents().stream()
            .map(StudentMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{studentId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STUDENT')")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable String studentId) {
        return studentService.getStudentById(studentId)
            .map(StudentMapper::toDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{studentId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable String studentId,
                                                    @RequestBody StudentDto dto) {
        if (!studentId.equals(dto.getStudentId())) {
            return ResponseEntity.badRequest().build();
        }
        Student student = StudentMapper.toModel(dto);
        Student updated = studentService.updateStudent(student);
        return ResponseEntity.ok(StudentMapper.toDto(updated));
    }

    @DeleteMapping("/{studentId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable String studentId) {
        boolean deleted = studentService.deleteStudent(studentId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}