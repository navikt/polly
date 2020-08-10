package no.nav.data.common.security;

import javax.servlet.http.HttpServletRequest;

public interface TokenProvider {

    String createSession(String code, String fullRequestUrlWithoutQuery);

    void destroySession();

    String createAuthRequestRedirectUrl(String usedRedirect, String errorUri, HttpServletRequest request);
}
