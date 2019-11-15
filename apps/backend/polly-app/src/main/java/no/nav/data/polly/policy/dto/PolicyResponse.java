package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.informationtype.dto.InformationTypeIdNameResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "process", "purposeCode", "subjectCategory", "start", "end", "active", "legalBasesInherited", "informationType", "legalBases"})
public class PolicyResponse {

    private UUID id;
    private PolicyProcessResponse process;
    private CodeResponse purposeCode;
    private CodeResponse subjectCategory;
    private LocalDate start;
    private LocalDate end;
    private boolean legalBasesInherited;
    private InformationTypeIdNameResponse informationType;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }
}
