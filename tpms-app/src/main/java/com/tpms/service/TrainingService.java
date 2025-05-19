package com.tpms.service;

import com.tpms.model.Training;
import java.util.List;
import java.util.Optional;

public interface TrainingService {
    Training createTraining(Training training);
    Optional<Training> getTrainingById(String trainingId);
    List<Training> getAllTrainings();
    Training updateTraining(Training training);
    boolean deleteTraining(String trainingId);
}