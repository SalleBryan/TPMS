package com.tpms.service.impl;

import com.tpms.model.*;
import com.tpms.repository.*;
import com.tpms.service.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class RecruiterServiceImpl implements RecruiterService {
    private final RecruiterRepository repo;
    public RecruiterServiceImpl(RecruiterRepository repo) { this.repo = repo; }

    @Override public Recruiter createRecruiter(Recruiter r) { return repo.save(r); }
    @Override public Optional<Recruiter> getRecruiterById(String id) { return repo.findByRecruiterId(id); }
    @Override public List<Recruiter> getAllRecruiters() { return repo.findAll(); }
    @Override public Recruiter updateRecruiter(Recruiter r) {
        Recruiter ex = repo.findByRecruiterId(r.getRecruiterId())
            .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        r.setId(ex.getId()); return repo.save(r);
    }
    @Override public boolean deleteRecruiter(String id) {
        Optional<Recruiter> opt=repo.findByRecruiterId(id);
        if(opt.isPresent()){repo.delete(opt.get());return true;} return false;
    }
}