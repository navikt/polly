package no.nav.data.polly.common.security;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class SecurityConstants {

    public static final String POLLY_COOKIE_NAME = "pollysession";
    // UUID hex without dashes
    public static final int SESS_ID_LEN = 32;
    public static final String TOKEN_TYPE = "Bearer ";

    public static final String REGISTRATION_ID = "azure";
    public static final String APPID_CLAIM = "appid";
    public static final String APPID_CLAIM_V2 = "azp";
    public static final String VER_CLAIM = "ver";
    public static final String USER_ID_CLAIM = "oid";

    public static final String MICROSOFT_GRAPH_SCOPE_V2 = "https://graph.microsoft.com/";
    public static final String MICROSOFT_GRAPH_SCOPE_APP = MICROSOFT_GRAPH_SCOPE_V2 + ".default";


    public static final Set<String> MICROSOFT_GRAPH_SCOPES = Set.of(
            "openid",
            MICROSOFT_GRAPH_SCOPE_V2 + "user.read"
    );

}
