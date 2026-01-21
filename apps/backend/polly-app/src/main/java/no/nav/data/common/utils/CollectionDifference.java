package no.nav.data.common.utils;

import lombok.Data;

import java.util.List;

/**
 * See {@link StreamUtils#difference(java.util.Collection, java.util.Collection, java.util.Comparator)}
 */
@Data
public class CollectionDifference<T> {

    private final List<T> before;
    private final List<T> after;

    private final List<T> removed;
    private final List<T> shared;
    private final List<T> added;

    public CollectionDifference(List<T> before, List<T> after, List<T> removed, List<T> shared, List<T> added) {
        this.before = before;
        this.after = after;
        this.removed = removed;
        this.shared = shared;
        this.added = added;
    }

    public String changeString() {
        return "removed=" + removed + ", added=" + added;
    }
}
