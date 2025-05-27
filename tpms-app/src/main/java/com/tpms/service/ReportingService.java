package com.tpms.service;

import java.util.Map;

/**
 * Provides aggregated reports.
 */
public interface ReportingService {
    /**
     * Returns number of placed students per department.
     */
    Map<String, Integer> placedPerDepartment();

    /**
     * Average time-to-placement in days.
     */
    double averageTimeToPlacement();
}