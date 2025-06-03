package com.tpms.repository;

import com.tpms.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository for Trainer entities.
 */
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Optional<Trainer> findByTrainerId(String trainerId);
}