package no.nav.data.polly.process.domain.repo;

import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.dto.ProcessVeryShortResponse;

import java.util.Arrays;
import java.util.UUID;

public interface ProcessVeryShort {

    UUID getId();

    String getName();

    int getNumber();

    String getPurposesJsonArray();

    default ProcessVeryShortResponse toResponse() {
        var purposeCodes = JsonUtils.toObject(getPurposesJsonArray(), String[].class);
        var purposes = CodelistService.getCodelistResponseList(ListName.PURPOSE, Arrays.asList(purposeCodes));

        return ProcessVeryShortResponse.builder()
                .id(getId())
                .name(getName())
                .number(getNumber())
                .purposes(purposes)
                .build();
    }

}
