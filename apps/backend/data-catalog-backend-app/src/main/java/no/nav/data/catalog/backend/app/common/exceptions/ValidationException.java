package no.nav.data.catalog.backend.app.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {
    private Map<String, Map> validationErrors;

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(Map<String, Map> validationErrors) {
        this.validationErrors = validationErrors;
    }

    public ValidationException(Map<String, Map> validationErrors, String message) {
        super(message + " " + validationErrors);
        this.validationErrors = validationErrors;
    }

    public Map<String, Map> get() {
        return validationErrors;
    }
}
