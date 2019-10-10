package no.nav.data.catalog.backend.app.common.utils;

public class StringUtils {

    private StringUtils() {
    }

    public static String ifNotNullToUppercaseAndTrim(String field) {
        return field == null ? null : field.toUpperCase().trim();
    }

    public static String ifNotNullTrim(String field) {
        return field == null ? null : field.trim();
    }
}
