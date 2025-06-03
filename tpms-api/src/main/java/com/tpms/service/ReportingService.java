package com.tpms.service;

import com.tpms.dto.ReportSummaryDto;

/**
 * Provides aggregated reports.
 */
public interface ReportingService {
    /**
     * Generate summary report data.
     * @return DTO containing report metrics
     */
    ReportSummaryDto generateSummaryReport();
}