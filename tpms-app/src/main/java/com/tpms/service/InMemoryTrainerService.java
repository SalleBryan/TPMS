package com.tpms.service;

import com.tpms.model.Trainer;
import java.util.*;

public class InMemoryTrainerService implements TrainerService {
    private final Map<String, Trainer> store = new HashMap<>();

    @Override
    public Trainer createTrainer(Trainer t) {
        store.put(t.getTrainerId(), t);
        return t;
    }
    @Override
    public Optional<Trainer> getTrainerById(String id) {
        return Optional.ofNullable(store.get(id));
    }
    @Override
    public List<Trainer> getAllTrainers() {
        return new ArrayList<>(store.values());
    }
    @Override
    public Trainer updateTrainer(Trainer t) {
        if (!store.containsKey(t.getTrainerId())) throw new TrainerNotFoundException(t.getTrainerId());
        store.put(t.getTrainerId(), t);
        return t;
    }
    @Override
    public boolean deleteTrainer(String id) {
        return store.remove(id) != null;
    }
}
