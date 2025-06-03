package com.tpms.controller;

import com.tpms.dto.RecruiterDto;
import com.tpms.mapper.RecruiterMapper;
import com.tpms.model.Recruiter;
import com.tpms.service.RecruiterService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recruiters")

public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RecruiterDto> createRecruiter(@RequestBody RecruiterDto dto) {
        Recruiter recruiter = RecruiterMapper.toModel(dto);
        Recruiter created = recruiterService.createRecruiter(recruiter);
        return ResponseEntity.ok(RecruiterMapper.toDto(created));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<RecruiterDto>> getAllRecruiters() {
        List<RecruiterDto> dtos = recruiterService.getAllRecruiters().stream()
            .map(RecruiterMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{recruiterId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_RECRUITER')")
    public ResponseEntity<RecruiterDto> getRecruiterById(@PathVariable String recruiterId) {
        return recruiterService.getRecruiterById(recruiterId)
            .map(RecruiterMapper::toDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{recruiterId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RecruiterDto> updateRecruiter(@PathVariable String recruiterId,
                                                        @RequestBody RecruiterDto dto) {
        if (!recruiterId.equals(dto.getRecruiterId())) {
            return ResponseEntity.badRequest().build();
        }
        Recruiter recruiter = RecruiterMapper.toModel(dto);
        Recruiter updated = recruiterService.updateRecruiter(recruiter);
        return ResponseEntity.ok(RecruiterMapper.toDto(updated));
    }

    @DeleteMapping("/{recruiterId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteRecruiter(@PathVariable String recruiterId) {
        boolean deleted = recruiterService.deleteRecruiter(recruiterId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}