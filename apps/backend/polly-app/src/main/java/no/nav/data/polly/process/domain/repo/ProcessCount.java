package no.nav.data.polly.process.domain.repo;

import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

import static java.util.stream.Collectors.toMap;

public interface ProcessCount {

    String getCode();

    Long getCount();

    static Map<String, Long> countToMap(List<ProcessCount> purposeCounts) {
        return countToMap(purposeCounts, null);
    }

    static Map<String, Long> countToMap(List<ProcessCount> counts, ListName listName) {
        return countToMap(counts, listName, false);
    }

    static Map<String, Long> countToMap(List<ProcessCount> counts, ListName listName, boolean keepEmpty) {
        Map<String, Long> map = counts.stream()
                .filter(c -> keepEmpty || c.getCode() != null)
                .map(c -> Map.entry(Optional.ofNullable(c.getCode()).orElse(""), c.getCount()))
                .collect(toMap(Entry::getKey, Entry::getValue));
        if (listName != null) {
            fillCountsWithZero(map, listName);
        }
        return map;
    }

    static void fillCountsWithZero(Map<String, Long> counts, ListName listName) {
        CodelistStaticService.getCodelist(listName).stream().filter(c -> !counts.containsKey(c.getCode())).forEach(c -> counts.put(c.getCode(), 0L));
    }
}
