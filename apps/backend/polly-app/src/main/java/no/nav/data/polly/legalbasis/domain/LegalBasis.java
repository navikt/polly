package no.nav.data.polly.legalbasis.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.elasticsearch.dto.LegalBasisElasticSearch;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.io.Serializable;
import java.time.LocalDate;
import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LegalBasis implements Serializable {

    @NotNull
    private String gdpr;
    private String nationalLaw;
    @NotNull
    private String description;
    @NotNull
    private LocalDate start;
    @NotNull
    private LocalDate end;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

    public LegalBasisResponse convertToResponse() {
        return new LegalBasisResponse(gdpr, nationalLaw, description, start, end);
    }

    public LegalBasisElasticSearch convertToElasticsearch() {
        return LegalBasisElasticSearch.builder()
                .gdpr(gdpr)
                .nationalLaw(nationalLaw)
                .description(description)
                .start(DateUtil.formatDate(start))
                .end(DateUtil.formatDate(end))
                .build();
    }

    public static class LegalBasisBuilder {

        public LegalBasisBuilder activeToday() {
            start = LocalDate.now();
            end = LocalDate.now();
            return this;
        }
    }
}
