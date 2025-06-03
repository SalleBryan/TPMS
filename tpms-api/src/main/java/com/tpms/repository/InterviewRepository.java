package com.tpms.repository;

import com.tpms.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

/**
 * Repository for Interview entities.
 */
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    Optional<Interview> findByInterviewId(String interviewId);
    List<Interview> findByStudentId(String studentId);
    List<Interview> findByJobId(String jobId);
}