package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "purposeCode", "department", "subDepartment", "start", "end", "active", "legalBases", "policies"})
public class ProcessPolicyResponse {

    private String id;
    private String name;
    private String purposeCode;
    private String department;
    private String subDepartment;
    private LocalDate start;
    private LocalDate end;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;
    @Singular
    private List<PolicyResponse> policies;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

}
