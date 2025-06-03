package com.tpms.service.impl;

import com.tpms.model.*;
import com.tpms.repository.*;
import com.tpms.service.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class JobServiceImpl implements JobService {
    private final JobRepository repo;
    public JobServiceImpl(JobRepository repo) { this.repo = repo; }

    @Override public Job createJob(Job job) { return repo.save(job); }
    @Override public Optional<Job> getJobById(String jobId) { return repo.findByJobId(jobId); }
    @Override public List<Job> getAllJobs() { return repo.findAll(); }
    @Override public Job updateJob(Job job) {
        Job ex = repo.findByJobId(job.getJobId())
            .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setId(ex.getId()); return repo.save(job);
    }
    @Override public boolean deleteJob(String jobId) {
        Optional<Job> opt = repo.findByJobId(jobId);
        if (opt.isPresent()) { repo.delete(opt.get()); return true;} return false;
    }
}