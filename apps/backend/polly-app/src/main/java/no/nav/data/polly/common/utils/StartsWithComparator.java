package no.nav.data.polly.common.utils;

import java.util.Comparator;

import static java.lang.String.CASE_INSENSITIVE_ORDER;
import static org.apache.commons.lang3.StringUtils.startsWithIgnoreCase;

public class StartsWithComparator implements Comparator<String> {

    private final String str;

    public static Comparator<String> startsWith(String str) {
        return new StartsWithComparator(str).thenComparing(CASE_INSENSITIVE_ORDER);
    }

    private StartsWithComparator(String str) {
        this.str = str;
    }

    @Override
    public int compare(String o1, String o2) {
        boolean o1Start = startsWithIgnoreCase(o1, str);
        boolean o2Start = startsWithIgnoreCase(o2, str);
        if (o1Start == o2Start) {
            return 0;
        } else {
            return o1Start ? -1 : 1;
        }
    }
}
