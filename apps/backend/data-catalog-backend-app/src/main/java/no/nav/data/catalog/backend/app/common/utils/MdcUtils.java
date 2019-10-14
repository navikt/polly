package no.nav.data.catalog.backend.app.common.utils;

import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

public final class MdcUtils {

    private MdcUtils() {
    }

    private static final String CORRELATION_ID = "correlationId";
    private static final String CALL_ID = "callId";
    private static final String USER_ID = "userId";
    private static final String CONSUMER_ID = "consumerId";

    private static String createUUID() {
        return UUID.randomUUID().toString();
    }

    public static String getOrGenerateCorrelationId() {
        return Optional.ofNullable(MDC.get(CORRELATION_ID)).orElse(createUUID());
    }

    public static void createCorrelationId() {
        MDC.put(CORRELATION_ID, createUUID());
    }

    public static void clearCorrelationId() {
        MDC.remove(USER_ID);
    }

    public static String getCallId() {
        return MDC.get(CALL_ID);
    }

    public static void setCallId(String correlationId) {
        MDC.put(CALL_ID, correlationId);
    }

    public static void clearCallId() {
        MDC.remove(CALL_ID);
    }

    public static String getUser() {
        return MDC.get(USER_ID);
    }

    public static void setUserFromSecurity() {
        setUser(getCurrentSecurityContextUser());
    }

    public static void setUser(String user) {
        MDC.put(USER_ID, user);
    }

    public static void clearUser() {
        MDC.remove(USER_ID);
    }

    public static void setConsumerId(String consumer) {
        MDC.put(CONSUMER_ID, consumer);
    }

    public static void clearConsumer() {
        MDC.remove(CONSUMER_ID);
    }

    public static Runnable wrapAsync(Runnable runnable, String user) {
        return () -> {
            setUser(user);
            setConsumerId(Constants.APP_ID);
            createCorrelationId();
            try {
                runnable.run();
            } finally {
                clearMdc();
            }
        };
    }

    private static String getCurrentSecurityContextUser() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(authentication -> authentication.getPrincipal() instanceof UserPrincipal ? (UserPrincipal) authentication.getPrincipal() : null)
                .map(principal -> String.format("%s - %s", getNAVident(principal), principal.getName()))
                .orElse("no-auth");
    }

    private static String getNAVident(UserPrincipal principal) {
        Object navClaim = principal.getClaim("NAVident");
        return navClaim == null ? "missing-ident" : ((String) navClaim);
    }

    private static void clearMdc() {
        createCorrelationId();
        clearCallId();
        clearUser();
        clearConsumer();
    }
}
