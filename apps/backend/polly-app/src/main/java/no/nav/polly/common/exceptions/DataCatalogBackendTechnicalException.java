package no.nav.polly.common.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
@Getter
public class DataCatalogBackendTechnicalException extends RuntimeException {

    private final HttpStatus httpStatus;

    public DataCatalogBackendTechnicalException(String message) {
        super(message);
        this.httpStatus = HttpStatus.OK;
    }

    public DataCatalogBackendTechnicalException(String message, Throwable cause) {
        super(message, cause);
        this.httpStatus = HttpStatus.OK;
    }

    public DataCatalogBackendTechnicalException(String message, Throwable cause, HttpStatus httpStatus) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }
}
