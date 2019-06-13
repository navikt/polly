package no.nav.data.catalog.backend.app.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {
    private HashMap<String, HashMap> validationErrors;

    public ValidationException(HashMap<String, HashMap> validationErrors) {
        this.validationErrors = validationErrors;
    }

    public ValidationException(HashMap<String, HashMap> validationErrors, String message) {
        super(message + " " + validationErrors);
        this.validationErrors = validationErrors;
    }

    public HashMap<String, HashMap> get() {
        return validationErrors;
    }
}
