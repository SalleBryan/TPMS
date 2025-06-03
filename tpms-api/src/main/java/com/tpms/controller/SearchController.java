package com.tpms.controller;

import com.tpms.dto.StudentDto;
import com.tpms.dto.TrainingDto;
import com.tpms.dto.JobDto;
import com.tpms.dto.RecruiterDto;
import com.tpms.mapper.StudentMapper;
import com.tpms.mapper.TrainingMapper;
import com.tpms.mapper.JobMapper;
import com.tpms.mapper.RecruiterMapper;
import com.tpms.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ROLE_STUDENT','ROLE_TRAINER','ROLE_RECRUITER','ROLE_ADMIN')")
    public ResponseEntity<List<StudentDto>> searchStudents(@RequestParam String department) {
        List<StudentDto> dtos = searchService.findStudentsByDepartment(department).stream()
            .map(StudentMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/trainings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TrainingDto>> searchTrainings(@RequestParam String title) {
        List<TrainingDto> dtos = searchService.findTrainingsByTitle(title).stream()
            .map(TrainingMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/jobs")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<JobDto>> searchJobs(@RequestParam String title) {
        List<JobDto> dtos = searchService.findJobsByTitle(title).stream()
            .map(JobMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/recruiters")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RecruiterDto>> searchRecruiters(@RequestParam String company) {
        List<RecruiterDto> dtos = searchService.findRecruitersByCompany(company).stream()
            .map(RecruiterMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}

