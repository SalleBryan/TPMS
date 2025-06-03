package com.tpms.service.impl;

import com.tpms.model.Student;
import com.tpms.model.Training;
import com.tpms.model.Job;
import com.tpms.model.Recruiter;
import com.tpms.repository.StudentRepository;
import com.tpms.repository.TrainingRepository;
import com.tpms.repository.JobRepository;
import com.tpms.repository.RecruiterRepository;
import com.tpms.service.SearchService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchServiceImpl implements SearchService {
    private final StudentRepository studentRepo;
    private final TrainingRepository trainingRepo;
    private final JobRepository jobRepo;
    private final RecruiterRepository recruiterRepo;

    public SearchServiceImpl(
        StudentRepository studentRepo,
        TrainingRepository trainingRepo,
        JobRepository jobRepo,
        RecruiterRepository recruiterRepo
    ) {
        this.studentRepo = studentRepo;
        this.trainingRepo = trainingRepo;
        this.jobRepo = jobRepo;
        this.recruiterRepo = recruiterRepo;
    }

    @Override
    public List<Student> findStudentsByDepartment(String department) {
        return studentRepo.findByDepartmentContainingIgnoreCase(department);
    }

    @Override
    public List<Training> findTrainingsByTitle(String title) {
        return trainingRepo.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Job> findJobsByTitle(String title) {
        return jobRepo.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Recruiter> findRecruitersByCompany(String company) {
        return recruiterRepo.findByCompanyContainingIgnoreCase(company);
    }
}
