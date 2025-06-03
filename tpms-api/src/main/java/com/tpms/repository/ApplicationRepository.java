package com.tpms.repository;

import com.tpms.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("SELECT s.department, COUNT(a) " +
           "FROM Application a JOIN Student s ON a.studentId = s.studentId " +
           "GROUP BY s.department")
    List<Object[]> countApplicationsByDepartment();

    @Query(
    value = "SELECT AVG(DATEDIFF(i.scheduled_at, a.applied_at)) " +
            "FROM application a JOIN interview i " +
            "ON a.student_id = i.student_id AND a.job_id = i.job_id",
    nativeQuery = true
       )
       Double findAverageTimeToPlacement();
       // @Query(
       // value = "SELECT AVG(DATEDIFF('DAY', a.applied_at, i.scheduled_at)) " +
       //        "FROM application a JOIN interview i " +
       //        "ON a.student_id = i.student_id AND a.job_id = i.job_id",
       // nativeQuery = true
       // )
       // Double findAverageTimeToPlacement();
}
