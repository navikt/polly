package no.nav.data.polly.informationtype.domain;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InformationTypeData {

    @NotNull
    private String name;
    private String description;
    private String sensitivity;
    private String orgMaster;
    @Builder.Default
    private List<String> productTeams = new ArrayList<>();
    @Builder.Default
    private List<String> categories = new ArrayList<>();
    @Builder.Default
    private List<String> sources = new ArrayList<>();
    @Builder.Default
    private List<String> keywords = new ArrayList<>();

    // Søkefelt
    private String suggest;

    public CodelistResponse sensitivityCode() {
        return CodelistService.getCodelistResponse(ListName.SENSITIVITY, sensitivity);
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class InformationTypeDataBuilder {

        // lombok @Singular enforcer immutable after build
        private List<String> productTeams = new ArrayList<>();
        private List<String> categories = new ArrayList<>();
        private List<String> keywords = new ArrayList<>();
        private List<String> sources = new ArrayList<>();

        public InformationTypeDataBuilder productTeams(String productTeam) {
            productTeams.add(productTeam);
            return this;
        }

        public InformationTypeDataBuilder category(String category) {
            categories.add(category);
            return this;
        }

        public InformationTypeDataBuilder keyword(String keyword) {
            keywords.add(keyword);
            return this;
        }

        public InformationTypeDataBuilder source(String source) {
            sources.add(source);
            return this;
        }
    }

}
