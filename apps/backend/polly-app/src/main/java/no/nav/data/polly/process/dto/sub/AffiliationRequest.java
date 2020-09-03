package no.nav.data.polly.process.dto.sub;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;
import no.nav.data.polly.codelist.domain.ListName;

import java.util.List;

import static no.nav.data.common.utils.StringUtils.formatList;
import static no.nav.data.common.utils.StringUtils.formatListToUppercase;
import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class AffiliationRequest implements Validated {

    @ApiModelProperty(value = "Codelist DEPARTMENT")
    private String department;
    @Singular
    @ApiModelProperty(value = "Codelist SUB_DEPARTMENT")
    private List<String> subDepartments;
    @Singular
    private List<String> productTeams;
    @Singular
    @ApiModelProperty(value = "Codelist SYSTEM")
    private List<String> products;

    @Override
    public void format() {
        setDepartment(toUpperCaseAndTrim(getDepartment()));
        setSubDepartments(formatListToUppercase(getSubDepartments()));
        setProductTeams(formatList(getProductTeams()));
        setProducts(formatListToUppercase(getProducts()));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkCodelist(Fields.department, department, ListName.DEPARTMENT);
        subDepartments.forEach(sd -> validator.checkCodelist(Fields.subDepartments, sd, ListName.SUB_DEPARTMENT));
        products.forEach(product -> validator.checkCodelist(Fields.products, product, ListName.SYSTEM));

    }
}
