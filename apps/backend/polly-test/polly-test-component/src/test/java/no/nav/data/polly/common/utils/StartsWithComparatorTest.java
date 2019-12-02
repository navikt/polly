package no.nav.data.polly.common.utils;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

class StartsWithComparatorTest {

    @Test
    void testOrder() {
        List<String> strings = Stream.of("hei på deg", "er du deg", "deg på hei", "deg, jeg og meg", "Degnasjon og helse")
                .sorted(StartsWithComparator.startsWith("deg"))
                .collect(Collectors.toList());

        Assertions.assertThat(strings)
                .containsSequence(
                        "deg på hei",
                        "deg, jeg og meg",
                        "Degnasjon og helse",
                        "er du deg",
                        "hei på deg"
                );
    }
}