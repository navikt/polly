package no.nav.data.polly.codelist;

import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import org.springframework.util.Assert;

import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Should not be used outside {@link CodelistService}
 */
final class CodelistCache {

    private CodelistCache() {
    }

    private static final Map<ListName, Map<String, Codelist>> codelists = new EnumMap<>(ListName.class);

    static {
        CodelistCache.init();
    }

    static void init() {
        Stream.of(ListName.values()).forEach(listName -> codelists.put(listName, new HashMap<>()));
    }

    static List<Codelist> getAll() {
        return codelists.values().stream().flatMap(e -> e.values().stream()).collect(Collectors.toList());
    }

    static List<Codelist> getCodelist(ListName name) {
        return List.copyOf(codelists.get(name).values());
    }

    static Codelist getCodelist(ListName listName, String code) {
        return codelists.get(listName).get(code);
    }

    static boolean contains(ListName listName, String code) {
        return codelists.get(listName).containsKey(code);
    }

    static void remove(ListName listName, String code) {
        codelists.get(listName).remove(code);
    }

    static void set(Codelist codelist) {
        Assert.notNull(codelist.getList(), "listName cannot be null");
        Assert.notNull(codelist.getCode(), "code cannot be null");
        Assert.notNull(codelist.getShortName(), "shortName cannot be null");
        Assert.notNull(codelist.getDescription(), "description cannot be null");
        codelists.get(codelist.getList()).put(codelist.getCode(), codelist);
    }
}
