package com.tpms.controller;

import com.tpms.dto.ReportSummaryDto;
import com.tpms.service.ReportingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportingController {

    private final ReportingService reportingService;

    public ReportingController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ReportSummaryDto> getSummaryReport() {
        ReportSummaryDto dto = reportingService.generateSummaryReport();
        return ResponseEntity.ok(dto);
    }
}
