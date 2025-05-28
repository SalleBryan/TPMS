package com.tpms.service;

import com.tpms.model.Interview;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class InterviewServiceImpl implements InterviewService {
    private final Map<String, Interview> interviews = new HashMap<>();

    @Override
    public void scheduleInterview(String studentId, String jobId, LocalDateTime when) {
        // Prevent student double-booking
        List<Interview> existing = listInterviewsForStudent(studentId);
        for (Interview i : existing) {
            if (i.getWhen().equals(when)) {
                throw new InterviewConflictException("Student " + studentId + " already has an interview at " + when);
            }
        }
        String id = UUID.randomUUID().toString();
        Interview interview = new Interview(id, studentId, jobId, when);
        interviews.put(id, interview);
    }

    @Override
    public void rescheduleInterview(String interviewId, LocalDateTime newWhen) {
        Interview i = Optional.ofNullable(interviews.get(interviewId))
            .orElseThrow(() -> new InterviewNotFoundException(interviewId));
        // Check conflict for that student
        List<Interview> existing = listInterviewsForStudent(i.getStudentId()).stream()
            .filter(inv -> !inv.getInterviewId().equals(interviewId))
            .collect(Collectors.toList());
        for (Interview other : existing) {
            if (other.getWhen().equals(newWhen)) {
                throw new InterviewConflictException("Conflict at " + newWhen);
            }
        }
        i.setWhen(newWhen);
    }

    @Override
    public void cancelInterview(String interviewId) {
        if (interviews.remove(interviewId) == null) {
            throw new InterviewNotFoundException(interviewId);
        }
    }

    @Override
    public List<Interview> listInterviewsForStudent(String studentId) {
        return interviews.values().stream()
            .filter(i -> i.getStudentId().equals(studentId))
            .collect(Collectors.toList());
    }
}
