package no.nav.data.common.security;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class SecurityConstants {

    public static final String COOKIE_NAME = "pollysession";
    // UUID hex without dashes
    public static final int SESS_ID_LEN = 32;
    public static final String TOKEN_TYPE = "Bearer ";

}
