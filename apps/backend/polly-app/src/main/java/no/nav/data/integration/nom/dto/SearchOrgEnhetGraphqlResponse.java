package no.nav.data.integration.nom.dto;

import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.integration.nom.domain.OrgEnhet;

import java.util.List;

@Data
@Builder
@FieldNameConstants
@NoArgsConstructor
@AllArgsConstructor
public class SearchOrgEnhetGraphqlResponse {
    private DataWrapper data;
    private ArrayNode errors;

    @Builder
    @Data
    public static class DataWrapper {

        List<OrgEnhet> searchOrgEnhet;

    }
}
