package com.tpms.service;

import java.io.File;

/**
 * Handles bulk import/export of data.
 */
public interface CsvService {
    void importStudents(File csvFile);
    void exportStudents(File csvFile);
}