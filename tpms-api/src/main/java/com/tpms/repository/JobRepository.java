package com.tpms.repository;

import com.tpms.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findByJobId(String jobId);
    List<Job> findByTitleContainingIgnoreCase(String title);
}