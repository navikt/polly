package no.nav.data.polly.disclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.disclosure.dto.DisclosureAbroadRequest;
import no.nav.data.polly.disclosure.dto.DisclosureAbroadResponse;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.copyOf;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DisclosureAbroad {

    private Boolean abroad;
    private List<String> countries;
    private String refToAgreement;
    private String businessArea;

    public DisclosureAbroadResponse convertToResponse() {
        return DisclosureAbroadResponse.builder()
                .abroad(abroad)
                .countries(copyOf(countries))
                .refToAgreement(refToAgreement)
                .businessArea(businessArea)
                .build();
    }

    public static DisclosureAbroad convertAbroad(DisclosureAbroadRequest request) {
        if (request == null) {
            return new DisclosureAbroad();
        }
        return DisclosureAbroad.builder()
                .abroad(request.getAbroad())
                .countries(copyOf(request.getCountries()))
                .refToAgreement(request.getRefToAgreement())
                .businessArea(request.getBusinessArea())
                .build();
    }
}
