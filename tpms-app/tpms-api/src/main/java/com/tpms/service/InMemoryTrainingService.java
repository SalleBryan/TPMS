package com.tpms.service;

import com.tpms.model.Training;
import java.util.*;

public class InMemoryTrainingService implements TrainingService {
    private final Map<String, Training> store = new HashMap<>();

    @Override
    public Training createTraining(Training t) {
        store.put(t.getTrainingId(), t);
        return t;
    }
    @Override
    public Optional<Training> getTrainingById(String id) {
        return Optional.ofNullable(store.get(id));
    }
    @Override
    public List<Training> getAllTrainings() {
        return new ArrayList<>(store.values());
    }
    @Override
    public Training updateTraining(Training t) {
        if (!store.containsKey(t.getTrainingId())) throw new TrainingNotFoundException(t.getTrainingId());
        store.put(t.getTrainingId(), t);
        return t;
    }
    @Override
    public boolean deleteTraining(String id) {
        return store.remove(id) != null;
    }
}