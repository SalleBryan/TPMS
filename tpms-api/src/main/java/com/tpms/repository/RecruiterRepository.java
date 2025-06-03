package com.tpms.repository;

import com.tpms.model.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    Optional<Recruiter> findByRecruiterId(String recruiterId);
    List<Recruiter> findByCompanyContainingIgnoreCase(String company);
}
