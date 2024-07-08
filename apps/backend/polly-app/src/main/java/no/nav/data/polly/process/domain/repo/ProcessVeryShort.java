package no.nav.data.polly.process.domain.repo;

import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.dto.ProcessVeryShortResponse;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;

import java.util.Arrays;
import java.util.UUID;

public interface ProcessVeryShort {

    UUID getId();

    String getName();

    int getNumber();

    String getPurposesJsonArray();

    String getAffiliationJson();

    default ProcessVeryShortResponse toResponse() {
        var purposeCodes = JsonUtils.toObject(getPurposesJsonArray(), String[].class);
        var affiliationString = JsonUtils.toObject(getAffiliationJson(), Affiliation.class);
        var purposes = CodelistStaticService.getCodelistResponseList(ListName.PURPOSE, Arrays.asList(purposeCodes));
        var affiliationResponse = AffiliationResponse.buildFrom(affiliationString);

        return ProcessVeryShortResponse.builder()
                .id(getId())
                .name(getName())
                .number(getNumber())
                .purposes(purposes)
                .affiliation(affiliationResponse)
                .build();
    }

}
