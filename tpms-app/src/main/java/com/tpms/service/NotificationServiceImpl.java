package com.tpms.service;

public class NotificationServiceImpl implements NotificationService {
    @Override
    public void notifyStudent(String studentId, String message) {
        // In a real app, send email/SMS. Here, just print.
        System.out.println("[Notify Student " + studentId + "] " + message);
    }

    @Override
    public void notifyRecruiter(String recruiterId, String message) {
        System.out.println("[Notify Recruiter " + recruiterId + "] " + message);
    }
}