package com.tpms.demo;

import com.tpms.service.InterviewServiceImpl;
import com.tpms.service.InterviewService;
import com.tpms.model.Interview;
import java.time.LocalDateTime;
import java.util.List;

public class InterviewDemo {
    public static void main(String[] args) {
        InterviewService service = new InterviewServiceImpl();
        String studentId = "S001";
        String jobId = "J001";
        LocalDateTime when1 = LocalDateTime.now().plusDays(1);
        LocalDateTime when2 = when1.plusHours(1);

        // Schedule two interviews
        service.scheduleInterview(studentId, jobId, when1);
        service.scheduleInterview(studentId, jobId, when2);
        System.out.println("Scheduled Interviews:");
        List<Interview> list = service.listInterviewsForStudent(studentId);
        list.forEach(System.out::println);

        // Attempt conflict
        try {
            service.scheduleInterview(studentId, jobId, when1);
        } catch (Exception ex) {
            System.out.println("Expected conflict: " + ex.getMessage());
        }

        // Reschedule
        Interview first = list.get(0);
        LocalDateTime newWhen = when2.plusHours(2);
        service.rescheduleInterview(first.getInterviewId(), newWhen);
        System.out.println("After reschedule:");
        service.listInterviewsForStudent(studentId).forEach(System.out::println);

        // Cancel
        service.cancelInterview(first.getInterviewId());
        System.out.println("After cancellation:");
        service.listInterviewsForStudent(studentId).forEach(System.out::println);
    }
}
