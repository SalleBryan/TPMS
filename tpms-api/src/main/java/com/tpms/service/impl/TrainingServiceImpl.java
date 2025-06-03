package com.tpms.service.impl;


import com.tpms.model.*;
import com.tpms.repository.*;
import com.tpms.service.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class TrainingServiceImpl implements TrainingService {
    private final TrainingRepository repo;
    public TrainingServiceImpl(TrainingRepository repo) { this.repo = repo; }

    @Override
    public Training createTraining(Training training) {
        return repo.save(training);
    }
    @Override public Optional<Training> getTrainingById(String trainingId) {
        return repo.findByTrainingId(trainingId);
    }
    @Override public List<Training> getAllTrainings() { return repo.findAll(); }
    @Override public Training updateTraining(Training training) {
        Training ex = repo.findByTrainingId(training.getTrainingId())
            .orElseThrow(() -> new RuntimeException("Training not found"));
        training.setId(ex.getId());
        return repo.save(training);
    }
    @Override public boolean deleteTraining(String trainingId) {
        Optional<Training> opt = repo.findByTrainingId(trainingId);
        if (opt.isPresent()) { repo.delete(opt.get()); return true; }
        return false;
    }
}

