package no.nav.data.polly.process.dto.sub;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"department", "subDepartments", "productTeams", "products"})
public class AffiliationResponse {

    private CodelistResponse department;
    @Singular
    private List<CodelistResponse> subDepartments;
    @Singular
    private List<String> productTeams;
    @Singular
    private List<CodelistResponse> products;

}
