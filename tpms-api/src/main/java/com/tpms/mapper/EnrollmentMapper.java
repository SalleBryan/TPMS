package com.tpms.mapper;

import com.tpms.model.Enrollment;
import com.tpms.dto.EnrollmentDto;

public class EnrollmentMapper {
    public static EnrollmentDto toDto(Enrollment model) {
        if (model == null) return null;
        return new EnrollmentDto(
            model.getId(),
            model.getStudentId(),
            model.getTrainingId(),
            model.getEnrolledAt()
        );
    }
    public static Enrollment toModel(EnrollmentDto dto) {
        if (dto == null) return null;
        Enrollment model = new Enrollment(
            dto.getStudentId(),
            dto.getTrainingId(),
            dto.getEnrolledAt()
        );
        if (dto.getId() != null) model.setId(dto.getId());
        return model;
    }
}
