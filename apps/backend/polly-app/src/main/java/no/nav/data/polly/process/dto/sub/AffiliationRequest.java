package no.nav.data.polly.process.dto.sub;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.domain.sub.Affiliation;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.copyOf;
import static no.nav.data.common.utils.StringUtils.formatList;
import static no.nav.data.common.utils.StringUtils.formatListToUppercase;
import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class AffiliationRequest implements Validated {

    @Schema(description = "Codelist DEPARTMENT")
    private String department;
    private String nomDepartmentId;
    private String nomDepartmentName;
    @Singular
    @Schema(description = "Codelist SUB_DEPARTMENT")
    private List<String> subDepartments;
    @Singular
    private List<String> productTeams;
    @Singular
    @Schema(description = "Codelist SYSTEM")
    private List<String> products;
    @Singular
    @Schema(description = "Codelist SYSTEM")
    private List<String> disclosureDispatchers;

    @Override
    public void format() {
        setDepartment(toUpperCaseAndTrim(getDepartment()));
        setNomDepartmentId(getNomDepartmentId());
        setNomDepartmentName(getNomDepartmentName());
        setSubDepartments(formatListToUppercase(getSubDepartments()));
        setProductTeams(formatList(getProductTeams()));
        setProducts(formatListToUppercase(getProducts()));
        setDisclosureDispatchers(formatListToUppercase(getDisclosureDispatchers()));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkCodelist(Fields.department, department, ListName.DEPARTMENT);
        subDepartments.forEach(sd -> validator.checkCodelist(Fields.subDepartments, sd, ListName.SUB_DEPARTMENT));
        products.forEach(product -> validator.checkCodelist(Fields.products, product, ListName.SYSTEM));
    }
    
    public Affiliation convertToAffiliation() {
        return Affiliation.builder()
                .department(getDepartment())
                .nomDepartmentId(getNomDepartmentId())
                .nomDepartmentName(getNomDepartmentName())
                .subDepartments(copyOf(getSubDepartments()))
                .productTeams(copyOf(getProductTeams()))
                .products(copyOf(getProducts()))
                .disclosureDispatchers(copyOf(getDisclosureDispatchers()))
                .build();
    }

}
