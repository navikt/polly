package no.nav.data.catalog.backend.app.common.utils;

import java.util.Comparator;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * See {@link StreamUtils#difference(List, List, Comparator)}
 */
@Data
@AllArgsConstructor
public class CollectionDifference<T> {

    private List<T> before;
    private List<T> after;

    private List<T> removed;
    private List<T> shared;
    private List<T> added;

}
