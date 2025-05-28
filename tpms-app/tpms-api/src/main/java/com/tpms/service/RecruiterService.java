package com.tpms.service;

import com.tpms.model.Recruiter;
import java.util.List;
import java.util.Optional;

public interface RecruiterService {
    Recruiter createRecruiter(Recruiter recruiter);
    Optional<Recruiter> getRecruiterById(String recruiterId);
    List<Recruiter> getAllRecruiters();
    Recruiter updateRecruiter(Recruiter recruiter);
    boolean deleteRecruiter(String recruiterId);
}