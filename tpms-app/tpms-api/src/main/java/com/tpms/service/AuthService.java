package com.tpms.service;

/**
 * Handles user registration and authentication.
 */
public interface AuthService {
    void registerUser(String username, String password, String role);
    String login(String username, String password); // returns a token
}