package no.nav.data.polly.codelist;

import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class CodelistUtils {

    public static Codelist createCodelist() {
        return createCodelist(ListName.SOURCE, "CODE", "shortName", "description");
    }

    public static Codelist createCodelist(ListName listName) {
        return createCodelist(listName, "CODE", "shortName", "description");
    }

    public static Codelist createCodelist(ListName listName, String code) {
        return createCodelist(listName, code, "shortName", "description");
    }

    public static Codelist createCodelist(ListName listName, String code, String shortName, String description) {
        return Codelist.builder()
                .list(listName)
                .code(code)
                .shortName(shortName)
                .description(description)
                .build();
    }

    public static CodelistRequest createCodelistRequest() {
        return createCodelistRequest("SOURCE", "CODE", "shortName", "description");
    }

    public static CodelistRequest createCodelistRequest(String listName) {
        return createCodelistRequest(listName, "CODE", "shortName", "description");
    }

    public static CodelistRequest createCodelistRequest(String listName, String code) {
        return createCodelistRequest(listName, code, code + "-shortName", "description");
    }

    public static CodelistRequest createCodelistRequest(String listName, String code, String shortName, String description) {
        return CodelistRequest.builder()
                .list(listName)
                .code(code)
                .shortName(shortName)
                .description(description)
                .build();
    }

    public static List<CodelistRequest> createNrOfCodelistRequests(int nrOfRequests) {
        return IntStream.rangeClosed(1, nrOfRequests).mapToObj(i -> createCodelistRequest("SOURCE", "CODE_NR_" + i)).collect(Collectors.toList());
    }
}
