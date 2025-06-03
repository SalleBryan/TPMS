package com.tpms.repository;

import com.tpms.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(String studentId);
    List<Enrollment> findByTrainingId(String trainingId);
}