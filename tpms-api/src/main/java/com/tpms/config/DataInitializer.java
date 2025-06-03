package com.tpms.config;

import com.tpms.model.Role;
import com.tpms.repository.RoleRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Seeds the roles table at application startup if empty.
 */
@Configuration
public class DataInitializer {
    @Bean
    public ApplicationRunner initializer(RoleRepository roleRepository) {
        return args -> {
            List<String> roles = List.of("ROLE_ADMIN", "ROLE_RECRUITER", "ROLE_TRAINER", "ROLE_STUDENT");
            for (String roleName : roles) {
                roleRepository.findByName(roleName)
                              .orElseGet(() -> roleRepository.save(new Role(roleName)));
            }
        };
    }
}