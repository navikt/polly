package no.nav.data.polly.common.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtil {

    private DateUtil() {
    }

    public static String formatDateTime(LocalDateTime date) {
        return date == null ? null : date.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
