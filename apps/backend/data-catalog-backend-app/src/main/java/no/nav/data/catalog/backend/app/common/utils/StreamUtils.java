package no.nav.data.catalog.backend.app.common.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

public final class StreamUtils {

    private StreamUtils() {
    }

    public static <T> Stream<T> safeStream(Collection<T> collection) {
        return collection == null ? Stream.empty() : collection.stream();
    }

    /**
     * Get change in two collections based on predicate to match equality
     *
     * @param before collection before
     * @param after collection after
     * @param comparator function to compare if elements are equal
     * @param <T> the type of the collections
     */
    public static <T> CollectionDifference<T> difference(List<T> before, List<T> after, Comparator<T> comparator) {
        List<T> removed = new ArrayList<>(before);
        List<T> shared = new ArrayList<>();
        List<T> added = new ArrayList<>(after);
        removed.removeIf(beforeElement -> {
            for (T afterElement : after) {
                if (comparator.compare(beforeElement, afterElement) == 0) {
                    shared.add(afterElement);
                    return true;
                }
            }
            return false;
        });
        added.removeIf(afterElement -> {
            for (T beforeElement : before) {
                if (comparator.compare(beforeElement, afterElement) == 0) {
                    return true;
                }
            }
            return false;
        });
        return new CollectionDifference<>(before, after, removed, shared, added);
    }

    public static <T> List<T> nullToEmptyList(List<T> list) {
        return list == null ? Collections.emptyList() : list;
    }
}
