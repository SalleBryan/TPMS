package com.tpms.service.impl;

import com.tpms.model.Interview;
import com.tpms.repository.InterviewRepository;
import com.tpms.service.InterviewService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Default implementation of InterviewService.
 */
@Service
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository repository;

    public InterviewServiceImpl(InterviewRepository repository) {
        this.repository = repository;
    }

    @Override
    public Interview scheduleInterview(Interview interview) {
        // Ensure unique interviewId
        repository.findByInterviewId(interview.getInterviewId())
            .ifPresent(existing -> {
                throw new RuntimeException("Interview ID already exists: " + interview.getInterviewId());
            });
        return repository.save(interview);
    }

    @Override
    public Optional<Interview> getInterviewById(String interviewId) {
        return repository.findByInterviewId(interviewId);
    }

    @Override
    public List<Interview> listAllInterviews() {
        return repository.findAll();
    }

    @Override
    public List<Interview> listInterviewsByStudent(String studentId) {
        return repository.findByStudentId(studentId);
    }

    @Override
    public List<Interview> listInterviewsByJob(String jobId) {
        return repository.findByJobId(jobId);
    }

    @Override
    public boolean cancelInterview(String interviewId) {
        Optional<Interview> opt = repository.findByInterviewId(interviewId);
        if (opt.isPresent()) {
            repository.delete(opt.get());
            return true;
        }
        return false;
    }
}
