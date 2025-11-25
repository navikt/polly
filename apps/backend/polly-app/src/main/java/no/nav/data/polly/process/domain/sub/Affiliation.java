package no.nav.data.polly.process.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Affiliation {

    private String department;
    private String nomDepartmentId;
    private String nomDepartmentName;
    private List<nomSeksjon> seksjoner;
    private List<String> subDepartments;
    private List<String> productTeams;
    private List<String> products;
    private List<String> disclosureDispatchers;

    // TODO: Avhengighet utover
    public CodelistResponse getDepartmentCodeResponse() {
        return CodelistStaticService.getCodelistResponse(ListName.DEPARTMENT, getDepartment());
    }

    // TODO: Avhengighet utover
    public List<CodelistResponse> getSubDepartmentCodeResponses() {
        return CodelistStaticService.getCodelistResponseList(ListName.SUB_DEPARTMENT, getSubDepartments());
    }

    // TODO: Avhengighet utover
    public List<CodelistResponse> getProductCodeResponses() {
        return CodelistStaticService.getCodelistResponseList(ListName.SYSTEM, getProducts());
    }

    // TODO: Avhengighet utover
    public List<CodelistResponse> getDisclosureDispatcherCodeResponses() {
        return CodelistStaticService.getCodelistResponseList(ListName.SYSTEM, getDisclosureDispatchers());
    }

}
