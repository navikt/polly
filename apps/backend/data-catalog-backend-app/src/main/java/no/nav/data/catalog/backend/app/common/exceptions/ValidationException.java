package no.nav.data.catalog.backend.app.common.exceptions;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {

    private Map<String, Map<String, String>> validationErrors;

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(Map<String, Map<String, String>> validationErrors) {
        this.validationErrors = validationErrors;
    }

    public ValidationException(Map<String, Map<String, String>> validationErrors, String message) {
        super(message + " " + validationErrors);
        this.validationErrors = validationErrors;
    }

    public Map<String, Map<String, String>> get() {
        return validationErrors;
    }
}
