package com.tpms.mapper;

import com.tpms.model.Student;
import com.tpms.dto.StudentDto;

/**
 * Utility class for mapping between Student entity and StudentDto.
 */
public class StudentMapper {

    /**
     * Convert Student entity to StudentDto.
     */
    public static StudentDto toDto(Student model) {
        if (model == null) {
            return null;
        }
        StudentDto dto = new StudentDto();
        dto.setStudentId(model.getStudentId());
        dto.setFullName(model.getFullName());
        dto.setDepartment(model.getDepartment());
        dto.setEmail(model.getEmail());
        dto.setCgpa(model.getCgpa());
        return dto;
    }

    /**
     * Convert StudentDto to Student entity.
     */
    public static Student toModel(StudentDto dto) {
        if (dto == null) {
            return null;
        }
        Student model = new Student();
        model.setStudentId(dto.getStudentId());
        model.setFullName(dto.getFullName());
        model.setDepartment(dto.getDepartment());
        model.setEmail(dto.getEmail());
        model.setCgpa(dto.getCgpa());
        return model;
    }
}