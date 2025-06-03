package com.tpms.service.impl;

import com.tpms.service.*;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Override
    public void notifyUser(String userId, String message) {
        // stub: print to console
        System.out.println("Notify " + userId + ": " + message);
    }
}