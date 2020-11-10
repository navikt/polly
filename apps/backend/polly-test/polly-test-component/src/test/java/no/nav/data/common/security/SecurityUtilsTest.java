package no.nav.data.common.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SecurityUtilsTest {

    @Test
    void getIdent() {
        assertThat(SecurityUtils.changeStampToIdent("S123456 - John Doe")).hasValue("S123456");
        assertThat(SecurityUtils.changeStampToIdent("no user")).isEmpty();
    }
}