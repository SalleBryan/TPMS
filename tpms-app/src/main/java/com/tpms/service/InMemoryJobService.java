package com.tpms.service;

import com.tpms.model.Job;
import java.util.*;

public class InMemoryJobService implements JobService {
    private final Map<String, Job> store = new HashMap<>();

    @Override
    public Job createJob(Job j) {
        store.put(j.getJobId(), j);
        return j;
    }
    @Override
    public Optional<Job> getJobById(String id) {
        return Optional.ofNullable(store.get(id));
    }
    @Override
    public List<Job> getAllJobs() {
        return new ArrayList<>(store.values());
    }
    @Override
    public Job updateJob(Job j) {
        if (!store.containsKey(j.getJobId())) throw new JobNotFoundException(j.getJobId());
        store.put(j.getJobId(), j);
        return j;
    }
    @Override
    public boolean deleteJob(String id) {
        return store.remove(id) != null;
    }
}