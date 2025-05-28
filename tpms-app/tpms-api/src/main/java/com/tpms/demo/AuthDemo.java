package com.tpms.demo;

import com.tpms.service.AuthService;
import com.tpms.service.AuthServiceImpl;
import com.tpms.service.InvalidCredentialsException;
import com.tpms.service.WeakPasswordException;

public class AuthDemo {
    public static void main(String[] args) {
        AuthService auth = new AuthServiceImpl();
        try {
            auth.registerUser("user1", "pasSTOENG123s", "STUDENT");
        } catch (WeakPasswordException ex) {
            System.out.println("Expected weak password: " + ex.getMessage());
        }
        // register properly
        auth.registerUser("user1", "StrongPass123", "STUDENT");
        try {
            String token = auth.login("user1", "StrongPass123");
        } catch (InvalidCredentialsException ex) {
            System.out.println("Expected invalid credentials.");
        }
        String token = auth.login("user1", "StrongPass123");
        System.out.println("Login token: " + token);
    }
}