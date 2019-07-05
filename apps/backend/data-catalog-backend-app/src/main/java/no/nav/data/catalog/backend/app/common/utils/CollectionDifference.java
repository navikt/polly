package no.nav.data.catalog.backend.app.common.utils;

import java.util.Collection;
import java.util.Comparator;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * See {@link StreamUtils#difference(Collection, Collection, Comparator)}
 */
@Data
@AllArgsConstructor
public class CollectionDifference<T> {

    private Collection<T> before;
    private Collection<T> after;

    private Collection<T> removed;
    private Collection<T> shared;
    private Collection<T> added;

}
