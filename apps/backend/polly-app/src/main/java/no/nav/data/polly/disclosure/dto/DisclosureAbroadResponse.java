package no.nav.data.polly.disclosure.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.disclosure.domain.DisclosureAbroad;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.copyOf;

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

    public static DisclosureAbroadResponse buildFrom(DisclosureAbroad da) {
        return DisclosureAbroadResponse.builder()
                .abroad(da.getAbroad())
                .countries(copyOf(da.getCountries()))
                .refToAgreement(da.getRefToAgreement())
                .businessArea(da.getBusinessArea())
                .build();
    }

}
