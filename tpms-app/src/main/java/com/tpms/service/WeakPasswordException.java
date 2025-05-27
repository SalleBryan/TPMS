package com.tpms.service;

public class WeakPasswordException extends RuntimeException {
    public WeakPasswordException() {
        super("Password does not meet strength requirements");
    }
}
