package com.tpms.mapper;

import com.tpms.dto.InterviewDto;
import com.tpms.model.Interview;

/**
 * Mapper for Interview entity and DTO.
 */
public class InterviewMapper {

    public static InterviewDto toDto(Interview model) {
        if (model == null) return null;
        return new InterviewDto(
            model.getId(),
            model.getInterviewId(),
            model.getStudentId(),
            model.getJobId(),
            model.getscheduledAt()
        );
    }

    public static Interview toModel(InterviewDto dto) {
        if (dto == null) return null;
        Interview model = new Interview(
            dto.getInterviewId(),
            dto.getStudentId(),
            dto.getJobId(),
            dto.getscheduledAt()
        );
        if (dto.getId() != null) {
            model.setId(dto.getId());
        }
        return model;
    }
}
