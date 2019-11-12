package no.nav.data.polly.informationtype.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class InformationTypeData {

    @NotNull
    private String name;
    private String description;
    private boolean pii;
    private String sensitivity;
    private List<String> categories = new ArrayList<>();
    private List<String> sources = new ArrayList<>();
    private List<String> keywords = new ArrayList<>();
    private String navMaster;  // Will adding this be confusing if we keep informationTypeMaster?

    // Keep?
    private InformationTypeMaster informationTypeMaster;

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class InformationTypeDataBuilder {

        // lombok @Singular enforcer immutable after build
        private List<String> categories = new ArrayList<>();
        private List<String> keywords = new ArrayList<>();
        private List<String> sources = new ArrayList<>();

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
