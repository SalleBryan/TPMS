package com.tpms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the TPMS API Spring Boot application.
 *
 * When you run `mvn spring-boot:run`, Spring Boot will bootstrap this class,
 * start the embedded web server, and scan for components (controllers, services,
 * repositories) under the `com.tpms` package.
 */
@SpringBootApplication
public class TpmsApiApplication {

    /**
     * Main method used by Maven and your IDE to launch the application.
     *
     * @param args command-line arguments (unused)
     */
    public static void main(String[] args) {
        SpringApplication.run(TpmsApiApplication.class, args);
    }
}
