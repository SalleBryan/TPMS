package com.tpms.service;

/**
 * Sends notifications to users via email/SMS.
 */
public interface NotificationService {
    void notifyStudent(String studentId, String message);
    void notifyRecruiter(String recruiterId, String message);
}