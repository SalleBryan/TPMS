package com.tpms.service;

public class ExportFailedException extends RuntimeException {
    public ExportFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}
