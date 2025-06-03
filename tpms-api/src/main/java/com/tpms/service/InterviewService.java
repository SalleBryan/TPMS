package com.tpms.service;

import com.tpms.model.Interview;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing interviews.
 */
public interface InterviewService {
    Interview scheduleInterview(Interview interview);
    Optional<Interview> getInterviewById(String interviewId);
    List<Interview> listAllInterviews();
    List<Interview> listInterviewsByStudent(String studentId);
    List<Interview> listInterviewsByJob(String jobId);
    boolean cancelInterview(String interviewId);
}