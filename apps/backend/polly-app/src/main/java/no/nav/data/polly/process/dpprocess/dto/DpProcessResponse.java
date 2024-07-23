package no.nav.data.polly.process.dpprocess.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.dpprocess.dto.sub.DpRetentionResponse;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;
import no.nav.data.polly.process.dto.sub.DataProcessingResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "affiliation", "externalProcessResponsible", "start", "end", "active",
        "dataProcessingAgreements", "subDataProcessing",
        "purposeDescription", "description", "art9", "art10", "retention", "changeStamp"})
public class DpProcessResponse {

    private UUID id;
    private String name;
    private AffiliationResponse affiliation;
    private CodelistResponse externalProcessResponsible;
    private LocalDate start;
    private LocalDate end;

    @Singular
    private List<String> dataProcessingAgreements;
    private DataProcessingResponse subDataProcessing;

    private String purposeDescription;
    private String description;
    private Boolean art9;
    private Boolean art10;

    private DpRetentionResponse retention;
    private int dpProcessNumber;

    private ChangeStampResponse changeStamp;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }
}
