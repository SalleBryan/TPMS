package com.tpms.mapper;

import com.tpms.model.Recruiter;
import com.tpms.dto.RecruiterDto;

/**
 * Utility class for mapping between Recruiter entity and RecruiterDto.
 */
public class RecruiterMapper {

    /**
     * Convert Recruiter entity to RecruiterDto.
     */
    public static RecruiterDto toDto(Recruiter model) {
        if (model == null) {
            return null;
        }
        RecruiterDto dto = new RecruiterDto();
        dto.setRecruiterId(model.getRecruiterId());
        dto.setFullName(model.getFullName());
        dto.setCompany(model.getCompany());
        dto.setEmail(model.getEmail());
        return dto;
    }

    /**
     * Convert RecruiterDto to Recruiter entity.
     */
    public static Recruiter toModel(RecruiterDto dto) {
        if (dto == null) {
            return null;
        }
        Recruiter model = new Recruiter();
        model.setRecruiterId(dto.getRecruiterId());
        model.setFullName(dto.getFullName());
        model.setCompany(dto.getCompany());
        model.setEmail(dto.getEmail());
        return model;
    }
}
