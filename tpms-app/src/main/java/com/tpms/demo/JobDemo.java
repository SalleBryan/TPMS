package com.tpms.demo;

import com.tpms.model.Job;
import com.tpms.service.*;

public class JobDemo {
    public static void main(String[] args) {
        JobService service = new InMemoryJobService();
        Job j = new Job("J001", "Software Engineer", "Develop Java apps", "RC01");
        service.createJob(j);
        System.out.println("Created: " + j);
    }
}