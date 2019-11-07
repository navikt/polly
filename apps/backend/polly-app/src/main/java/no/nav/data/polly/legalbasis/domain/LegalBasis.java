package no.nav.data.polly.legalbasis.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.elasticsearch.dto.LegalBasisElasticsearch;
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
        return new LegalBasisResponse(gdprCodeResponse(), nationalLawCodeResponse(), description, start, end);
    }

    public LegalBasisElasticsearch convertToElasticsearch() {
        return LegalBasisElasticsearch.builder()
                .gdpr(gdprCodeResponse())
                .nationalLaw(nationalLawCodeResponse())
                .description(description)
                .start(DateUtil.formatDate(start))
                .end(DateUtil.formatDate(end))
                .active(isActive())
                .build();
    }

    private CodeResponse gdprCodeResponse() {
        return CodelistService.getCodeResponse(ListName.GDPR_ARTICLE, gdpr);
    }

    private CodeResponse nationalLawCodeResponse() {
        return CodelistService.getCodeResponse(ListName.NATIONAL_LAW, nationalLaw);
    }

    public static class LegalBasisBuilder {

        public LegalBasisBuilder activeToday() {
            start = LocalDate.now();
            end = LocalDate.now();
            return this;
        }
    }
}
