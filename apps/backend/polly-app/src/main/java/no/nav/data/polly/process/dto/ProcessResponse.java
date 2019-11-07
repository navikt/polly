package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.SuperBuilder;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.time.LocalDate;
import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id,", "name", "purposeCode", "department", "subDepartment", "start", "end", "active", "legalBases"})
public class ProcessResponse {

    private String id;
    private String name;
    private String purposeCode;
    private CodeResponse department;
    private CodeResponse subDepartment;
    private LocalDate start;
    private LocalDate end;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

}
