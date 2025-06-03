package com.tpms.service;

import com.tpms.model.Student;
import com.tpms.model.Training;
import com.tpms.model.Job;
import com.tpms.model.Recruiter;
import java.util.List;

public interface SearchService {
    List<Student> findStudentsByDepartment(String department);
    List<Training> findTrainingsByTitle(String title);
    List<Job> findJobsByTitle(String title);
    List<Recruiter> findRecruitersByCompany(String company);
}