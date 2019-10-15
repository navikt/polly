package no.nav.data.catalog.backend.app.codelist;

import org.springframework.util.Assert;

import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Should not be used outside {@link CodelistService}
 */
final class CodelistCache {

    private CodelistCache() {
    }

    // Preserve backwards compatibility for rest for now
    private static final Map<ListName, Map<String, String>> codelistLegacy = new EnumMap<>(ListName.class);
    private static final Map<ListName, Map<String, Codelist>> codelists = new EnumMap<>(ListName.class);

    static void init() {
        Stream.of(ListName.values()).forEach(listName -> {
            codelists.put(listName, new HashMap<>());
            codelistLegacy.put(listName, new HashMap<>());
        });
    }

    static Codelist getCodelist(ListName listName, String code) {
        return codelists.get(listName).get(Codelist.normalize(code));
    }

    static boolean contains(ListName listName, String code) {
        return codelists.get(listName).containsKey(Codelist.normalize(code));
    }

    static void remove(ListName listName, String code) {
        Codelist remove = codelists.get(listName).remove(Codelist.normalize(code));
        if (remove != null) {
            codelistLegacy.get(listName).remove(remove.getCode());
        }
    }

    static void set(Codelist codelist) {
        Assert.notNull(codelist.getList(), "listName cannot be null");
        Assert.notNull(codelist.getCode(), "code cannot be null");
        Assert.notNull(codelist.getNormalizedCode(), "normalizedCode cannot be null");
        Assert.notNull(codelist.getDescription(), "description cannot be null");
        codelists.get(codelist.getList()).put(codelist.getNormalizedCode(), codelist);
        codelistLegacy.get(codelist.getList()).put(codelist.getCode(), codelist.getDescription());
    }

    @Deprecated
    static Map<ListName, Map<String, String>> getAllAsMap() {
        return codelistLegacy;
    }

    @Deprecated
    static Map<String, String> getAsMap(ListName listName) {
        return codelistLegacy.get(listName);
    }
}
