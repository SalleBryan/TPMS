package com.tpms.service;

/**
 * Handles bulk import/export of data.
 */
public interface CsvService {
    /**
     * Import students from CSV data.
     */
    void importStudents(byte[] csvData);

    /**
     * Export all students to CSV.
     */
    byte[] exportStudents();
}