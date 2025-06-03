package com.tpms.service.impl;

import com.tpms.model.*;
import com.tpms.repository.*;
import com.tpms.service.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class TrainerServiceImpl implements TrainerService {
    private final TrainerRepository repo;
    public TrainerServiceImpl(TrainerRepository repo) { this.repo = repo; }

    @Override public Trainer createTrainer(Trainer t) { return repo.save(t); }
    @Override public Optional<Trainer> getTrainerById(String id) { return repo.findByTrainerId(id); }
    @Override public List<Trainer> getAllTrainers() { return repo.findAll(); }
    @Override public Trainer updateTrainer(Trainer t) {
        Trainer ex = repo.findByTrainerId(t.getTrainerId())
            .orElseThrow(() -> new RuntimeException("Trainer not found"));
        t.setId(ex.getId()); return repo.save(t);
    }
    @Override public boolean deleteTrainer(String id) {
        Optional<Trainer> opt=repo.findByTrainerId(id);
        if(opt.isPresent()){repo.delete(opt.get());return true;} return false;
    }
}