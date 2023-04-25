package no.nav.data.polly.document.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseRequest;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentData {

    private String name;
    private String description;
    private List<InformationTypeUse> informationTypes;
    private String dataAccessClass;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InformationTypeUse {

        private UUID informationTypeId;
        private List<String> subjectCategories;

        public static InformationTypeUse convertFromRequest(DocumentInfoTypeUseRequest request) {
            return InformationTypeUse.builder()
                    .informationTypeId(UUID.fromString(request.getInformationTypeId()))
                    .subjectCategories(request.getSubjectCategories())
                    .build();
        }
    }
}
