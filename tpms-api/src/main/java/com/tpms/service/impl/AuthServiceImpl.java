package com.tpms.service.impl;

import com.tpms.dto.LoginRequest;
import com.tpms.dto.SignupRequest;
import com.tpms.model.Account;
import com.tpms.model.Role;
import com.tpms.repository.AccountRepository;
import com.tpms.repository.RoleRepository;
import com.tpms.security.JwtTokenProvider;
import com.tpms.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of AuthService for signup and login.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtProvider;
    private final AuthenticationManager authManager;

    public AuthServiceImpl(AccountRepository accountRepo,
                           RoleRepository roleRepo,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtProvider,
                           AuthenticationManager authManager) {
        this.accountRepo = accountRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.authManager = authManager;
    }

    @Override
    public String signup(SignupRequest request) {
        if (accountRepo.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setEmail(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));

        Set<Role> roles = request.getRoles().stream()
            .map(roleName -> roleRepo.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName)))
            .collect(Collectors.toSet());
        account.setRoles(roles);

        accountRepo.save(account);
        return "User registered successfully";
    }

    @Override
    public String login(LoginRequest request) {
        // Authenticate user and obtain Authentication with UserDetails principal
        Authentication authentication = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        // Generate JWT token using the authenticated principal
        return jwtProvider.generateToken(authentication);
    }
}
