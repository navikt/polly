package no.nav.data.catalog.backend.test.integration.util;

import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;

import java.lang.annotation.Inherited;

/**
 * AutoConfigureWireMock er ikke @{@link Inherited}
 */
@Inherited
@AutoConfigureWireMock(port = 0)
public @interface EnableWiremock {

}

