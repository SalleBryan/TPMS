package com.tpms.repository;

import com.tpms.model.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TrainingRepository extends JpaRepository<Training, Long> {
    Optional<Training> findByTrainingId(String trainingId);
    List<Training> findByTitleContainingIgnoreCase(String title);
}