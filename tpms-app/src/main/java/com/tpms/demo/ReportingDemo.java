package com.tpms.demo;

import com.tpms.service.ReportingService;
import com.tpms.service.ReportingServiceImpl;
import java.util.Map;

public class ReportingDemo {
    public static void main(String[] args) {
        ReportingService report = new ReportingServiceImpl();
        Map<String, Integer> placed = report.placedPerDepartment();
        System.out.println("Placed per department: " + placed);
        double avg = report.averageTimeToPlacement();
        System.out.println("Average time to placement: " + avg);
    }
}