package no.nav.data.polly.process.domain;

import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import static java.util.stream.Collectors.toMap;

public interface ProcessCount {

    String getCode();

    Long getCount();

    static Map<String, Long> countToMap(List<ProcessCount> purposeCounts) {
        return countToMap(purposeCounts, null);
    }

    static Map<String, Long> countToMap(List<ProcessCount> counts, ListName listName) {
        Map<String, Long> map = counts.stream()
                .filter(c -> c.getCode() != null)
                .map(c -> Map.entry(c.getCode(), c.getCount()))
                .collect(toMap(Entry::getKey, Entry::getValue));
        if (listName != null) {
            fillCountsWithZero(map, listName);
        }
        return map;
    }

    static void fillCountsWithZero(Map<String, Long> counts, ListName listName) {
        CodelistService.getCodelist(listName).stream().filter(c -> !counts.containsKey(c.getCode())).forEach(c -> counts.put(c.getCode(), 0L));
    }
}
