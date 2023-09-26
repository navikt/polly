package no.nav.data.polly.disclosure.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.process.dto.ProcessShortResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "recipient", "recipientPurpose", "start", "end", "active",
        "documentId", "informationTypeIds", "processIds",
        "document", "informationTypes", "processes", "legalBases", "abroad"})
public class DisclosureResponse {

    private UUID id;
    private String name;
    private String description;
    private CodelistResponse recipient;
    private String recipientPurpose;
    private LocalDate start;
    private LocalDate end;
    private UUID documentId;
    private List<UUID> informationTypeIds;
    private List<UUID> processIds;
    private DocumentResponse document;
    private List<ProcessShortResponse> processes;
    private List<InformationTypeShortResponse> informationTypes;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;
    private DisclosureAbroadResponse abroad;
    private ChangeStampResponse changeStamp;
    private Boolean thirdCountryReceiver;
    private String administrationArchiveCaseNumber;
    private Boolean assessedConfidentiality;
    private String confidentialityDescription;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

}
