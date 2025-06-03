package com.tpms.dto;

import java.util.Map;

public class ReportSummaryDto {
    private Map<String, Integer> placedPerDepartment;
    private double averageTimeToPlacement;

    public ReportSummaryDto() {}

    public ReportSummaryDto(Map<String, Integer> placedPerDepartment, double averageTimeToPlacement) {
        this.placedPerDepartment = placedPerDepartment;
        this.averageTimeToPlacement = averageTimeToPlacement;
    }

    public Map<String, Integer> getPlacedPerDepartment() { return placedPerDepartment; }
    public void setPlacedPerDepartment(Map<String, Integer> placedPerDepartment) {
        this.placedPerDepartment = placedPerDepartment;
    }

    public double getAverageTimeToPlacement() { return averageTimeToPlacement; }
    public void setAverageTimeToPlacement(double averageTimeToPlacement) {
        this.averageTimeToPlacement = averageTimeToPlacement;
    }
}