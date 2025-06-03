package com.tpms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

/**
 * Request payload for user registration.
 */
public class SignupRequest {

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    /** Roles requested for this user (e.g. ["ROLE_STUDENT"], ["ROLE_ADMIN"]) */
    private Set<String> roles;

    public SignupRequest() {
        // Default constructor for deserialization
    }

    public SignupRequest(String username, String email, String password, Set<String> roles) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "SignupRequest{" +
               "username='" + username + '\'' +
               ", email='" + email + '\'' +
               ", password='[PROTECTED]'" +
               ", roles=" + roles +
               '}';
    }
}
