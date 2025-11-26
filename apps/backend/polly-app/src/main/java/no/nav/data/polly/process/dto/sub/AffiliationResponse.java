package no.nav.data.polly.process.dto.sub;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.domain.sub.NomData;
import no.nav.data.polly.process.domain.sub.nomSeksjon;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"department", "subDepartments", "productTeams", "products"})
public class AffiliationResponse {

    private CodelistResponse department;
    private String nomDepartmentId;
    private String nomDepartmentName;
    private List<nomSeksjon> seksjoner;
    private List<NomData> fylker;
    private List<NomData> navKontorer;
    @Singular
    private List<CodelistResponse> subDepartments;
    @Singular
    private List<String> productTeams;
    @Singular
    private List<CodelistResponse> products;
    @Singular
    private List<CodelistResponse> disclosureDispatchers;

    public static AffiliationResponse buildFrom(Affiliation aff) {
        return AffiliationResponse.builder()
                .department(aff.getDepartmentCodeResponse())
                .nomDepartmentId(aff.getNomDepartmentId())
                .nomDepartmentName(aff.getNomDepartmentName())
                .seksjoner(nullToEmptyList(aff.getSeksjoner()))
                .fylker(nullToEmptyList(aff.getFylker()))
                .navKontorer(nullToEmptyList(aff.getNavKontorer()))
                .subDepartments(aff.getSubDepartmentCodeResponses())
                .productTeams(nullToEmptyList(aff.getProductTeams()))
                .products(aff.getProductCodeResponses())
                .disclosureDispatchers(aff.getDisclosureDispatcherCodeResponses())
                .build();
    }

}
