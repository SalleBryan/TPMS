package com.tpms.service.impl;

import com.tpms.dto.ReportSummaryDto;
import com.tpms.service.ReportingService;
import com.tpms.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportingServiceImpl implements ReportingService {
    private final ApplicationRepository applicationRepository;

    public ReportingServiceImpl(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Override
    public ReportSummaryDto generateSummaryReport() {
        // Fetch counts per department
        List<Object[]> rawCounts = applicationRepository.countApplicationsByDepartment();
        Map<String, Integer> placedPerDepartment = new HashMap<>();
        for (Object[] row : rawCounts) {
            String department = (String) row[0];
            Long count = (Long) row[1];
            placedPerDepartment.put(department, count.intValue());
        }

        // Fetch average time to placement
        Double avgDays = applicationRepository.findAverageTimeToPlacement();
        double averageTime = (avgDays != null) ? avgDays : 0.0;

        return new ReportSummaryDto(placedPerDepartment, averageTime);
    }
}