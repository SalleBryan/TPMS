package com.tpms.service;

/**
 * Sends notifications to users via email/SMS.
 */
public interface NotificationService {
    /**
     * Send a notification message to a user.
     */
    void notifyUser(String userId, String message);
}