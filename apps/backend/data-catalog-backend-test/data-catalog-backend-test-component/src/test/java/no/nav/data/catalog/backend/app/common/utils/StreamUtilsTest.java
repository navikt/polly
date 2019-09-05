package no.nav.data.catalog.backend.app.common.utils;

import org.junit.Test;

import java.util.Comparator;
import java.util.function.Function;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;

public class StreamUtilsTest {

    @Test
    public void testDifference() {
        CollectionDifference<String> difference = StreamUtils.difference(asList("a", "b", "c", "d"), asList("a", "c", "e", "f"), Comparator.comparing(Function.identity()));

        assertEquals(asList("b", "d"), difference.getRemoved());
        assertEquals(asList("a", "c"), difference.getShared());
        assertEquals(asList("e", "f"), difference.getAdded());
    }
}