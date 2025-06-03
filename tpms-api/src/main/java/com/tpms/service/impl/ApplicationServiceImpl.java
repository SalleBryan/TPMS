package com.tpms.service.impl;

import com.tpms.model.Application;
import com.tpms.repository.ApplicationRepository;
import com.tpms.service.ApplicationService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository repo;

    public ApplicationServiceImpl(ApplicationRepository repo) {
        this.repo = repo;
    }

    @Override
    public Application apply(String studentId, String jobId) {
        Application app = new Application(studentId, jobId, LocalDateTime.now());
        return repo.save(app);
    }

    @Override
    public List<Application> getApplicationsByStudent(String studentId) {
        return repo.findAll().stream()
            .filter(a -> a.getStudentId().equals(studentId))
            .toList();
    }

    @Override
    public List<Application> getApplicationsByJob(String jobId) {
        return repo.findAll().stream()
            .filter(a -> a.getJobId().equals(jobId))
            .toList();
    }
}
