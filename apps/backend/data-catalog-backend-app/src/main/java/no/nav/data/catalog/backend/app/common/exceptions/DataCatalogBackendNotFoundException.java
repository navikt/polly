package no.nav.data.catalog.backend.app.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class DataCatalogBackendNotFoundException extends RuntimeException {
	public DataCatalogBackendNotFoundException(String message) {
		super(message);
	}
}
