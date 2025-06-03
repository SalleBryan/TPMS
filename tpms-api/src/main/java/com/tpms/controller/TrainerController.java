package com.tpms.controller;

import com.tpms.dto.TrainerDto;
import com.tpms.mapper.TrainerMapper;
import com.tpms.model.Trainer;
import com.tpms.service.TrainerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<TrainerDto> createTrainer(@RequestBody TrainerDto dto) {
        Trainer trainer = TrainerMapper.toModel(dto);
        Trainer created = trainerService.createTrainer(trainer);
        return ResponseEntity.ok(TrainerMapper.toDto(created));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<TrainerDto>> getAllTrainers() {
        List<TrainerDto> dtos = trainerService.getAllTrainers().stream()
            .map(TrainerMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{trainerId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_TRAINER')")
    public ResponseEntity<TrainerDto> getTrainerById(@PathVariable String trainerId) {
        return trainerService.getTrainerById(String.valueOf(trainerId))
            .map(TrainerMapper::toDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{trainerId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<TrainerDto> updateTrainer(@PathVariable String trainerId,
                                                    @RequestBody TrainerDto dto) {
        if (!trainerId.equals(dto.getTrainerId())) {
            return ResponseEntity.badRequest().build();
        }
        Trainer trainer = TrainerMapper.toModel(dto);
        Trainer updated = trainerService.updateTrainer(trainer);
        return ResponseEntity.ok(TrainerMapper.toDto(updated));
    }

    @DeleteMapping("/{trainerId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteTrainer(@PathVariable String trainerId) {
        boolean deleted = trainerService.deleteTrainer(trainerId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
