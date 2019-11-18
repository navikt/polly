package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.SuperBuilder;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id,", "name", "purposeCode", "department", "subDepartment", "start", "end", "active", "legalBases"})
public class ProcessResponse {

    private UUID id;
    private String name;
    private String purposeCode;
    private CodelistResponse department;
    private CodelistResponse subDepartment;
    private LocalDate start;
    private LocalDate end;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

}
