package com.tpms.mapper;

import com.tpms.model.Trainer;
import com.tpms.dto.TrainerDto;

/**
 * Utility class for mapping between Trainer entity and TrainerDto.
 */
public class TrainerMapper {

    /**
     * Convert Trainer entity to TrainerDto.
     */
    public static TrainerDto toDto(Trainer model) {
        if (model == null) {
            return null;
        }
        TrainerDto dto = new TrainerDto();
        dto.setTrainerId(model.getTrainerId());
        dto.setFullName(model.getFullName());
        dto.setExpertise(model.getExpertise());
        dto.setEmail(model.getEmail());
        return dto;
    }

    /**
     * Convert TrainerDto to Trainer entity.
     */
    public static Trainer toModel(TrainerDto dto) {
        if (dto == null) {
            return null;
        }
        Trainer model = new Trainer();
        model.setTrainerId(dto.getTrainerId());
        model.setFullName(dto.getFullName());
        model.setExpertise(dto.getExpertise());
        model.setEmail(dto.getEmail());
        return model;
    }
}
