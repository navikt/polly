package no.nav.data.polly.common.utils;

import org.apache.logging.log4j.util.Strings;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

public final class StringUtils {

    private StringUtils() {
    }

    public static String toUpperCaseAndTrim(String field) {
        return field == null ? null : field.toUpperCase().trim();
    }

    public static List<String> formatList(List<String> strings) {
        return safeStream(strings).map(Strings::trimToNull).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public static List<String> formatListToUppercase(List<String> strings) {
        return safeStream(strings).map(Strings::trimToNull).filter(Objects::nonNull).map(String::toUpperCase).collect(Collectors.toList());
    }
}
