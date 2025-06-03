package com.tpms.mapper;

import com.tpms.model.Job;
import com.tpms.dto.JobDto;

/**
 * Utility class for mapping between Job entity and JobDto.
 */
public class JobMapper {

    /**
     * Convert Job entity to JobDto.
     */
    public static JobDto toDto(Job model) {
        if (model == null) {
            return null;
        }
        JobDto dto = new JobDto();
        dto.setJobId(model.getJobId());
        dto.setTitle(model.getTitle());
        dto.setDescription(model.getDescription());
        dto.setRecruiterId(model.getRecruiterId());
        return dto;
    }

    /**
     * Convert JobDto to Job entity.
     */
    public static Job toModel(JobDto dto) {
        if (dto == null) {
            return null;
        }
        Job model = new Job();
        model.setJobId(dto.getJobId());
        model.setTitle(dto.getTitle());
        model.setDescription(dto.getDescription());
        model.setRecruiterId(dto.getRecruiterId());
        return model;
    }
}
