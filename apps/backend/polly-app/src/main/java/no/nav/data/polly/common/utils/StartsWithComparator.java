package no.nav.data.polly.common.utils;

import org.apache.commons.lang3.StringUtils;

import java.util.Comparator;

import static java.lang.String.CASE_INSENSITIVE_ORDER;

/**
 * String comparator that first sorts strings that start with a given prefix, then alphabetically
 */
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
        var o1Start = StringUtils.indexOfIgnoreCase(o1, str);
        var o2Start = StringUtils.indexOfIgnoreCase(o2, str);
        if (o1Start < 0 && o2Start >= 0) {
            return 1;
        }
        return o1Start - o2Start;
    }
}
