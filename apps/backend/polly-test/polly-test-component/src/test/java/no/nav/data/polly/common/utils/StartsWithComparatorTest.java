package no.nav.data.polly.common.utils;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

class StartsWithComparatorTest {

    @Test
    void testOrder() {
        List<String> strings = Stream.of("hei på deg", "er du deg", "deg på hei", "deg, jeg og meg", "Degnasjon og helse", "ingen treff her")
                .sorted(StartsWithComparator.startsWith("deg"))
                .collect(Collectors.toList());

        assertThat(strings)
                .containsSequence(
                        "deg på hei",
                        "deg, jeg og meg",
                        "Degnasjon og helse",
                        "er du deg",
                        "hei på deg",
                        "ingen treff her"
                );
    }

    @Test
    void testOrderAgain() {
        var strings = Stream.of("some text", "we have here-and here", "here-to-there")
                .sorted(StartsWithComparator.startsWith("here-"))
                .collect(Collectors.toList());

        assertThat(strings)
                .containsSequence(
                        "here-to-there",
                        "we have here-and here",
                        "some text"
                );
    }
}