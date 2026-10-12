package no.nav.data.common.web;

import no.nav.data.common.exceptions.CodelistNotErasableException;
import no.nav.data.common.exceptions.CodelistNotFoundException;
import no.nav.data.common.exceptions.DocumentNotFoundException;
import no.nav.data.common.exceptions.ForbiddenException;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import jakarta.persistence.OptimisticLockException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global exception handler that returns the exception message in the response body,
 * restoring behaviour from Spring Boot 3 that was changed in Spring Boot 4.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(ValidationException ex) {
        return errorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler({NotFoundException.class, DocumentNotFoundException.class})
    public ResponseEntity<Map<String, Object>> handleNotFoundException(RuntimeException ex) {
        return errorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String, Object>> handleForbiddenException(ForbiddenException ex) {
        return errorResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(CodelistNotErasableException.class)
    public ResponseEntity<Map<String, Object>> handleCodelistNotErasableException(CodelistNotErasableException ex) {
        return errorResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(CodelistNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleCodelistNotFoundException(CodelistNotFoundException ex) {
        return errorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /**
     * Optimistisk låsing: raden er endret eller slettet av noen andre etter at klienten leste den.
     * Dekker også ObjectOptimisticLockingFailureException og JpaOptimisticLockingFailureException,
     * som begge arver fra OptimisticLockingFailureException.
     */
    @ExceptionHandler({OptimisticLockingFailureException.class, OptimisticLockException.class})
    public ResponseEntity<Map<String, Object>> handleOptimisticLockingFailure(Exception ex) {
        log.info("Optimistic locking conflict: {}", ex.getMessage());
        return errorResponse(HttpStatus.CONFLICT,
                "Dataene er endret av noen andre etter at du hentet dem. Last inn på nytt og prøv igjen.");
    }

    private ResponseEntity<Map<String, Object>> errorResponse(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}

