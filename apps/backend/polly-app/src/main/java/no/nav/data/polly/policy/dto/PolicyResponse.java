package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"id", "process", "purposeCode", "subjectCategories", "start", "end", "active", "legalBases", "informationType"})
public class PolicyResponse {

    private UUID id;
    private String process;
    private CodeResponse purposeCode;
    private String subjectCategories;
    private LocalDate start;
    private LocalDate end;
    private List<LegalBasisResponse> legalBases;
    private InformationTypeNameResponse informationType;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }
}
