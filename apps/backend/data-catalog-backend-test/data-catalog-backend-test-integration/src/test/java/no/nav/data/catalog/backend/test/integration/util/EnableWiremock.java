package no.nav.data.catalog.backend.test.integration.util;

import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * AutoConfigureWireMock er ikke @{@link Inherited}
 */
@Inherited
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@AutoConfigureWireMock(port = 0)
public @interface EnableWiremock {

}

