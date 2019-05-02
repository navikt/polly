package no.nav.data.catalog.backend.app.common.exceptions;

import java.util.HashMap;

public class ValidationException extends RuntimeException {
    private HashMap<String, String> validationErrors;

    public ValidationException(HashMap<String, String> validationErrors) {
        this.validationErrors = validationErrors;
    }

    public ValidationException(HashMap<String, String> validationErrors, String message) {
        super(message);
        this.validationErrors = validationErrors;
    }

    public HashMap<String, String> get() {
        return validationErrors;
    }
}
