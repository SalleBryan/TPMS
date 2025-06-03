package com.tpms.controller;

import com.tpms.dto.TrainingDto;
import com.tpms.mapper.TrainingMapper;
import com.tpms.model.Training;
import com.tpms.service.TrainingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trainings")
public class TrainingController {

    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_TRAINER')")
    public ResponseEntity<TrainingDto> createTraining(@RequestBody TrainingDto dto) {
        Training training = TrainingMapper.toModel(dto);
        Training created = trainingService.createTraining(training);
        return ResponseEntity.ok(TrainingMapper.toDto(created));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STUDENT','ROLE_TRAINER')")
    public ResponseEntity<List<TrainingDto>> getAllTrainings() {
        List<TrainingDto> dtos = trainingService.getAllTrainings().stream()
            .map(TrainingMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{trainingId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STUDENT','ROLE_TRAINER')")
    public ResponseEntity<TrainingDto> getTrainingById(@PathVariable String trainingId) {
        return trainingService.getTrainingById(trainingId)
            .map(TrainingMapper::toDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{trainingId}")
    @PreAuthorize("hasRole('ROLE_TRAINER')")
    public ResponseEntity<TrainingDto> updateTraining(@PathVariable String trainingId,
                                                      @RequestBody TrainingDto dto) {
        if (!trainingId.equals(dto.getTrainingId())) {
            return ResponseEntity.badRequest().build();
        }
        Training training = TrainingMapper.toModel(dto);
        Training updated = trainingService.updateTraining(training);
        return ResponseEntity.ok(TrainingMapper.toDto(updated));
    }

    @DeleteMapping("/{trainingId}")
    @PreAuthorize("hasRole('ROLE_TRAINER')")
    public ResponseEntity<Void> deleteTraining(@PathVariable String trainingId) {
        boolean deleted = trainingService.deleteTraining(trainingId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}