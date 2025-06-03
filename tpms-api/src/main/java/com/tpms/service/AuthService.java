package com.tpms.service;

import com.tpms.dto.LoginRequest;
import com.tpms.dto.SignupRequest;

/**
 * Authentication service for user registration and login.
 */
public interface AuthService {
    /**
     * Register a new user account.
     * @param request contains username, email, password, and roles
     * @return confirmation message
     */
    String signup(SignupRequest request);

    /**
     * Authenticate a user and generate a JWT token.
     * @param request contains username and password
     * @return JWT token string
     */
    String login(LoginRequest request);
}