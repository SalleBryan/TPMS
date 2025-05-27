package com.tpms.service;

import java.time.LocalDateTime;
import java.util.List;
import com.tpms.model.Interview;

/**
 * Schedules Interviews between students and recruiters.
 */
public interface InterviewService {
    /**
     * Schedule a new interview.
     */
    void scheduleInterview(String studentId, String jobId, LocalDateTime when);

    /**
     * Reschedule an existing interview.
     */
    void rescheduleInterview(String interviewId, LocalDateTime newWhen);

    /**
     * Cancel a scheduled interview.
     */
    void cancelInterview(String interviewId);

    /**
     * List all interviews for a student.
     */
    List<Interview> listInterviewsForStudent(String studentId);
}