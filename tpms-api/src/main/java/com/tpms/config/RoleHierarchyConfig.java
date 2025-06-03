package com.tpms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;

@Configuration
public class RoleHierarchyConfig {

    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl hierarchy = new RoleHierarchyImpl();
        hierarchy.setHierarchy(
                "ROLE_ADMIN > ROLE_RECRUITER\n" +
                "ROLE_ADMIN > ROLE_TRAINER\n" +
                "ROLE_ADMIN > ROLE_STUDENT\n" +
                "ROLE_RECRUITER > ROLE_STUDENT\n" +
                "ROLE_TRAINER > ROLE_STUDENT"
        );
        return hierarchy;
    }
}
