package no.nav.data.polly.term.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.term.dto.TermResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PollyTerm {

    private String id;
    private String name;
    private String description;

    // TODO: Snu avhengigheten innover
    public TermResponse convertToResponse() {
        return TermResponse.builder()
                .id(id)
                .name(name)
                .description(description)
                .build();
    }

}
