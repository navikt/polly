package no.nav.data.polly.disclosure.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "recipient", "recipientPurpose", "start", "end", "active", "documentId", "document", "legalBases"})
public class DisclosureResponse {

    private UUID id;
    private String name;
    private String description;
    private CodelistResponse recipient;
    private String recipientPurpose;
    private LocalDate start;
    private LocalDate end;
    private UUID documentId;
    private DocumentResponse document;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

}
