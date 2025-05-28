package com.tpms.demo;

import com.tpms.model.Recruiter;
import com.tpms.service.InMemoryRecruiterService;
import com.tpms.service.RecruiterService;

public class RecruiterDemo {
    public static void main(String[] args) {
        RecruiterService service = new InMemoryRecruiterService();
        Recruiter r = new Recruiter("RC01", "Acme Corp", "Acme Corp", "hr@acme.com");
        service.createRecruiter(r);
        System.out.println("Created: " + r);
    }
}