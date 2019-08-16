package no.nav.data.catalog.backend.app.common.utils;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;

import java.util.Comparator;
import java.util.function.Function;

import no.nav.data.catalog.backend.app.common.utils.CollectionDifference;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import org.junit.Test;

public class StreamUtilsTest {

    @Test
    public void testDifference() {
        CollectionDifference<String> difference = StreamUtils.difference(asList("a", "b", "c", "d"), asList("a", "c", "e", "f"), Comparator.comparing(Function.identity()));

        assertEquals(difference.getRemoved(), asList("b", "d"));
        assertEquals(difference.getShared(), asList("a", "c"));
        assertEquals(difference.getAdded(), asList("e", "f"));
    }
}