package no.nav.data.polly.process.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.utils.StringUtils;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;
import no.nav.data.polly.codelist.domain.ListName;

import java.util.UUID;

import static org.apache.commons.lang3.StringUtils.trim;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class ProcessRevisionRequest implements Validated {

    public enum ProcessSelection {
        ONE,
        ALL,
        DEPARTMENT,
        PRODUCT_AREA,
    }

    private ProcessSelection processSelection;
    private UUID processId;
    @Schema(description = "Codelist DEPARTMENT")
    private String department;
    private String productAreaId;
    private String revisionText;

    @Override
    public void format() {
        setDepartment(StringUtils.toUpperCaseAndTrim(department));
        setProductAreaId(trim(productAreaId));
        setRevisionText(trim(revisionText));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkNull(Fields.processSelection, processSelection);
        switch (processSelection) {
            case ONE -> validator.checkNull(Fields.processId, processId);
            case DEPARTMENT -> validator.checkRequiredCodelist(Fields.department, department, ListName.DEPARTMENT);
            case PRODUCT_AREA -> validator.checkNull(Fields.productAreaId, productAreaId);
        }
    }
}
