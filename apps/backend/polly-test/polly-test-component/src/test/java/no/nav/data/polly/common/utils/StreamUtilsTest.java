package no.nav.data.polly.common.utils;

import org.junit.jupiter.api.Test;

import java.util.Comparator;
import java.util.function.Function;

import static java.util.Arrays.asList;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class StreamUtilsTest {

    @Test
    void testDifference() {
        CollectionDifference<String> difference = StreamUtils.difference(asList("a", "b", "c", "d"), asList("a", "c", "e", "f"), Comparator.comparing(Function.identity()));

        assertEquals(asList("b", "d"), difference.getRemoved());
        assertEquals(asList("a", "c"), difference.getShared());
        assertEquals(asList("e", "f"), difference.getAdded());
    }
}