package no.nav.data.polly.process.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.dto.sub.AffiliationRequest;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.copyOf;
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Affiliation {

    private String department;
    private List<String> subDepartments;
    private List<String> productTeams;
    private List<String> products;

    public static Affiliation convertAffiliation(AffiliationRequest request) {
        if (request == null) {
            return new Affiliation();
        }
        return Affiliation.builder()
                .department(request.getDepartment())
                .subDepartments(copyOf(request.getSubDepartments()))
                .productTeams(copyOf(request.getProductTeams()))
                .products(copyOf(request.getProducts()))
                .build();
    }

    public AffiliationResponse convertToResponse() {
        return AffiliationResponse.builder()
                .department(getDepartmentCodeResponse())
                .subDepartments(getSubDepartmentCodeResponses())
                .productTeams(nullToEmptyList(getProductTeams()))
                .products(getProductCodeResponses())
                .build();
    }

    public CodelistResponse getDepartmentCodeResponse() {
        return CodelistService.getCodelistResponse(ListName.DEPARTMENT, getDepartment());
    }

    public List<CodelistResponse> getSubDepartmentCodeResponses() {
        return CodelistService.getCodelistResponseList(ListName.SUB_DEPARTMENT, getSubDepartments());
    }

    public List<CodelistResponse> getProductCodeResponses() {
        return CodelistService.getCodelistResponseList(ListName.SYSTEM, getProducts());
    }

}
