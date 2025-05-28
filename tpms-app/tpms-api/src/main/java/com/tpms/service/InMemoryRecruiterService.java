package com.tpms.service;

import com.tpms.model.Recruiter;
import java.util.*;

public class InMemoryRecruiterService implements RecruiterService {
    private final Map<String, Recruiter> store = new HashMap<>();

    @Override
    public Recruiter createRecruiter(Recruiter r) {
        store.put(r.getRecruiterId(), r);
        return r;
    }
    @Override
    public Optional<Recruiter> getRecruiterById(String id) {
        return Optional.ofNullable(store.get(id));
    }
    @Override
    public List<Recruiter> getAllRecruiters() {
        return new ArrayList<>(store.values());
    }
    @Override
    public Recruiter updateRecruiter(Recruiter r) {
        if (!store.containsKey(r.getRecruiterId())) throw new RecruiterNotFoundException(r.getRecruiterId());
        store.put(r.getRecruiterId(), r);
        return r;
    }
    @Override
    public boolean deleteRecruiter(String id) {
        return store.remove(id) != null;
    }
}
