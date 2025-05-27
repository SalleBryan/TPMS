package com.tpms.service;

import java.util.*;

public class AuthServiceImpl implements AuthService {
    private final Map<String, String> users = new HashMap<>();      // username -> password (plain-text for demo)
    private final Map<String, String> roles = new HashMap<>();      // username -> role

    @Override
    public void registerUser(String username, String password, String role) {
        if (users.containsKey(username)) {
            throw new IllegalArgumentException("User already exists: " + username);
        }
        if (password.length() < 8) {
            throw new WeakPasswordException();
        }
        users.put(username, password);
        roles.put(username, role);
    }

    @Override
    public String login(String username, String password) {
        String stored = users.get(username);
        if (stored == null || !stored.equals(password)) {
            throw new InvalidCredentialsException();
        }
        // return a dummy token
        return Base64.getEncoder().encodeToString((username + ":" + roleOf(username)).getBytes());
    }

    private String roleOf(String username) {
        return roles.get(username);
    }
}