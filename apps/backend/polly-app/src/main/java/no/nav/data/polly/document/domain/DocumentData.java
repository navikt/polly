package no.nav.data.polly.document.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseRequest;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentData implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String name;
    private String description;
    private List<InformationTypeUse> informationTypes;
    private String dataAccessClass;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InformationTypeUse implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

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
