package no.nav.data.polly.common.utils;

import no.nav.data.polly.common.exceptions.PollyNotFoundException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import static java.util.Comparator.comparing;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toList;

public final class StreamUtils {

    private StreamUtils() {
    }

    public static <T> Stream<T> safeStream(Iterable<T> iterable) {
        return iterable == null ? Stream.empty() : StreamSupport.stream(iterable.spliterator(), false);
    }

    /**
     * Get change in two collections based on predicate to match equality
     *
     * @param before collection before
     * @param after collection after
     * @param comparator function to compare if elements are equal
     * @param <T> the type of the collections
     */
    public static <T> CollectionDifference<T> difference(Collection<T> before, Collection<T> after, Comparator<? super T> comparator) {
        List<T> removed = new ArrayList<>(before);
        List<T> shared = new ArrayList<>();
        List<T> added = new ArrayList<>(after);
        removed.removeIf(beforeElement -> {
            for (T afterElement : after) {
                if (comparator.compare(beforeElement, afterElement) == 0) {
                    shared.add(afterElement);
                    added.remove(afterElement);
                    return true;
                }
            }
            return false;
        });
        return new CollectionDifference<>(new ArrayList<>(before), new ArrayList<>(after), removed, shared, added);
    }

    public static <T extends Comparable<T>> CollectionDifference<T> difference(Collection<T> before, Collection<T> after) {
        return difference(before, after, comparing(identity()));
    }

    public static <T> List<T> nullToEmptyList(List<T> list) {
        return list == null ? Collections.emptyList() : list;
    }

    public static <T> List<T> copyOf(List<T> list) {
        return list == null ? Collections.emptyList() : List.copyOf(list);
    }

    public static <T> List<T> union(List<T> listA, List<T> listB) {
        ArrayList<T> list = new ArrayList<>(listA);
        list.addAll(listB);
        return list;
    }

    public static <T, F> List<T> convert(Collection<F> from, Function<F, T> converter) {
        return safeStream(from).map(converter).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public static <T, F> List<T> convertFlat(Collection<F> from, Function<F, List<T>> converter) {
        return safeStream(from).flatMap(o -> converter.apply(o).stream()).collect(toList());
    }

    @SafeVarargs
    public static <T, F> List<T> applyAll(Collection<F> from, Function<F, Collection<T>>... converters) {
        return Stream.of(converters)
                .map(f -> convert(from, f))
                .flatMap(Collection::stream)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }

    @SafeVarargs
    public static <T, F> List<T> applyAll(F from, Function<F, Collection<T>>... converters) {
        return Stream.of(converters)
                .map(f -> f.apply(from))
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }

    public static <T> List<T> filter(Iterable<T> objects, Predicate<T> filter) {
        return safeStream(objects).filter(filter).collect(Collectors.toList());
    }

    public static <T> T get(Iterable<T> objects, Predicate<T> filter) {
        return find(objects, filter).orElseThrow(() -> new PollyNotFoundException("could not find item"));
    }

    public static <T> Optional<T> find(Iterable<T> objects, Predicate<T> filter) {
        return safeStream(objects).filter(filter).findFirst();
    }
}
