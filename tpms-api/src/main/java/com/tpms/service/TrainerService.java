package com.tpms.service;

import com.tpms.model.Trainer;
import java.util.List;
import java.util.Optional;

public interface TrainerService {
    Trainer createTrainer(Trainer trainer);
    Optional<Trainer> getTrainerById(String trainerId);
    List<Trainer> getAllTrainers();
    Trainer updateTrainer(Trainer trainer);
    boolean deleteTrainer(String trainerId);
}