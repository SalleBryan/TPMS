package com.tpms.mapper;

import com.tpms.model.Application;
import com.tpms.dto.ApplicationDto;

public class ApplicationMapper {

    public static ApplicationDto toDto(Application model) {
        if (model == null) return null;
        return new ApplicationDto(
            model.getId(),
            model.getStudentId(),
            model.getJobId(),
            model.getAppliedAt()
        );
    }

    public static Application toModel(ApplicationDto dto) {
        if (dto == null) return null;
        Application model = new Application(
            dto.getStudentId(),
            dto.getJobId(),
            dto.getAppliedAt()
        );
        if (dto.getId() != null) model.setId(dto.getId());
        return model;
    }
}
