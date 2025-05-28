package com.tpms.service;

import com.tpms.model.Job;
import java.util.List;
import java.util.Optional;

public interface JobService {
    Job createJob(Job job);
    Optional<Job> getJobById(String jobId);
    List<Job> getAllJobs();
    Job updateJob(Job job);
    boolean deleteJob(String jobId);
}
