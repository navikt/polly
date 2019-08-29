package no.nav.data.catalog.backend.app.common.validator;

import lombok.Data;

import java.io.Serializable;

@Data
public class ValidationError implements Serializable {
    private String reference;
    private String errorType;
    private String errorMessage;

    public ValidationError(String reference, String errorType, String errorMessage) {
        this.reference = reference;
        this.errorType = errorType;
        this.errorMessage = errorMessage;
    }

    @Override
    public String toString() {
        return String.format("%s -- %s -- %s", reference, errorType, errorMessage);
    }


    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }

        if (other == null || other.getClass() != this.getClass()) {
            return false;
        }

        ValidationError otherValidationError = (ValidationError) other;
        return (reference != null && reference.equals(otherValidationError.getReference())) &&
                (errorType != null && errorType.equals(otherValidationError.getErrorType())) &&
                (errorMessage != null && errorMessage.equals(otherValidationError
                        .getErrorMessage()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((reference == null) ? 0 : reference.hashCode());
        result = prime * result + ((errorType == null) ? 0 : errorType.hashCode());
        result = prime * result + ((errorMessage == null) ? 0 : errorMessage.hashCode());
        return result;
    }
}