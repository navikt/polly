package no.nav.data.polly.common.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtil {

    public static final String DEFAULT_START = "0001-01-01";
    public static final String DEFAULT_END = "9999-12-31";
    public static final LocalDate DEFAULT_START_DATE = parse(DEFAULT_START);
    public static final LocalDate DEFAULT_END_DATE = parse(DEFAULT_END);

    private DateUtil() {
    }

    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime == null ? null : dateTime.format(DateTimeFormatter.ISO_DATE_TIME);
    }

    public static String formatDate(LocalDate date) {
        return date == null ? null : date.format(DateTimeFormatter.ISO_DATE);
    }

    public static boolean isNow(LocalDate start, LocalDate end) {
        return (start == null || start.minusDays(1).isBefore(LocalDate.now())) &&
                (end == null || end.plusDays(1).isAfter(LocalDate.now()));
    }

    public static LocalDate parse(String date) {
        return date == null ? null : LocalDate.parse(date);
    }

    public static LocalDate parseStart(String start) {
        return start == null ? DEFAULT_START_DATE : parse(start);
    }

    public static LocalDate parseEnd(String end) {
        return end == null ? DEFAULT_END_DATE : parse(end);
    }
}
