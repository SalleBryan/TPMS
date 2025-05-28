// StudentNotFoundException.java
package com.tpms.service;

/**
 * Custom exception thrown when a Student is not found in the system.
 */
public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(String studentId) {
        super("Student not found: " + studentId);
    }
}
