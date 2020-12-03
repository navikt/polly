package no.nav.data.polly.disclosure.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"abroad", "countries", "refToAgreement", "businessArea"})
public class DisclosureAbroadResponse {


    private Boolean abroad;
    @Singular
    private List<String> countries;
    private String refToAgreement;
    private String businessArea;
}
