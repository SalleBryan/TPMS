package com.tpms.demo;

import com.tpms.service.NotificationService;
import com.tpms.service.NotificationServiceImpl;

public class NotificationDemo {
    public static void main(String[] args) {
        NotificationService notifier = new NotificationServiceImpl();
        notifier.notifyStudent("S001", "Your training starts tomorrow.");
        notifier.notifyRecruiter("RC01", "New application received.");
    }
}