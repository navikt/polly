package no.nav.data.catalog.backend.app.common.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public final class DateUtil {

    private DateUtil() {
    }

    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

    public static String formatDate(Date date) {
        return date == null ? null : sdf.format(date);
    }
}
