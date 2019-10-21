package no.nav.data.polly.common.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
@Getter
public class PollyTechnicalException extends RuntimeException {

    private final HttpStatus httpStatus;

    public PollyTechnicalException(String message) {
        super(message);
        this.httpStatus = HttpStatus.OK;
    }

    public PollyTechnicalException(String message, Throwable cause) {
        super(message, cause);
        this.httpStatus = HttpStatus.OK;
    }

    public PollyTechnicalException(String message, Throwable cause, HttpStatus httpStatus) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }
}
