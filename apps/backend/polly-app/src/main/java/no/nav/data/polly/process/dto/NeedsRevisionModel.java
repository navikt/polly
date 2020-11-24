package no.nav.data.polly.process.dto;

import lombok.Builder;
import lombok.Data;
import no.nav.data.common.template.Model;
import no.nav.data.common.template.Template;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class NeedsRevisionModel implements Model {

    private final Template template;

    private final List<ProcessData> processes;
    private final String revisionText;
    private final String revisionRequestedBy;

    @Data
    @Builder
    public static class ProcessData {

        private final String processUrl;
        private final List<CodelistResponse> purposes;
        private final String name;

        public String getPurposeNames() {
            return purposes.stream().map(CodelistResponse::getShortName).collect(Collectors.joining(", "));
        }

    }
}
