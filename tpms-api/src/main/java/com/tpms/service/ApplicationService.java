package com.tpms.service;

import com.tpms.model.Application;
import java.util.List;

public interface ApplicationService {
    Application apply(String studentId, String jobId);
    List<Application> getApplicationsByStudent(String studentId);
    List<Application> getApplicationsByJob(String jobId);
}