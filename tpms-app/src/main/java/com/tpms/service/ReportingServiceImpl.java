package com.tpms.service;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

public class ReportingServiceImpl implements ReportingService {
    @Override
    public Map<String, Integer> placedPerDepartment() {
        // Demo implementation: return random counts
        Map<String, Integer> report = new HashMap<>();
        report.put("CE", 10);
        report.put("EE", 5);
        report.put("ME", 7);
        return report;
    }

    @Override
    public double averageTimeToPlacement() {
        // Demo: random average between 10 and 30 days
        return 10 + ThreadLocalRandom.current().nextDouble() * 20;
    }
}