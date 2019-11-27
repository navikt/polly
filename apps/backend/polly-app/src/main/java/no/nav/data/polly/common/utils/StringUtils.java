package no.nav.data.polly.common.utils;

public final class StringUtils {

    private StringUtils() {
    }

    public static String toUpperCaseAndTrim(String field) {
        return field == null ? null : field.toUpperCase().trim();
    }
}
