package com.tpms.mapper;

import com.tpms.model.Training;
import com.tpms.dto.TrainingDto;

/**
 * Utility class for mapping between Training entity and TrainingDto.
 */
public class TrainingMapper {

    /**
     * Convert Training entity to TrainingDto.
     */
    public static TrainingDto toDto(Training model) {
        if (model == null) {
            return null;
        }
        TrainingDto dto = new TrainingDto();
        dto.setTrainingId(model.getTrainingId());
        dto.setTitle(model.getTitle());
        dto.setDescription(model.getDescription());
        dto.setTrainerId(model.getTrainerId());
        dto.setTrainingDate(model.getTrainingDate());
        dto.setTrainingTime(model.getTrainingTime());
        dto.setVenue(model.getVenue());
        return dto;
    }

    /**
     * Convert TrainingDto to Training entity.
     */
    public static Training toModel(TrainingDto dto) {
        if (dto == null) {
            return null;
        }
        Training model = new Training();
        model.setTrainingId(dto.getTrainingId());
        model.setTitle(dto.getTitle());
        model.setDescription(dto.getDescription());
        model.setTrainerId(dto.getTrainerId());
        model.setTrainingDate(dto.getTrainingDate());
        model.setTrainingTime(dto.getTrainingTime());
        model.setVenue(dto.getVenue());
        return model;
    }
}
