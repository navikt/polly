package no.nav.polly.common.utils;

public class StringUtils {

    private StringUtils() {
    }

    public static String ifNotNullToUppercaseAndTrim(String field) {
        return field == null ? null : field.toUpperCase().trim();
    }
}
