package no.nav.data.polly.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class CodelistNotErasableException extends IllegalStateException {
    public CodelistNotErasableException(String message) {
        super(message);
    }
}
