package no.nav.data.common.template;

import no.nav.data.common.security.SecurityProperties;
import no.nav.data.common.template.FreemarkerConfig.FreemarkerService;
import no.nav.data.common.utils.MdcUtils;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.dto.NeedsRevisionModel;
import no.nav.data.polly.process.dto.NeedsRevisionModel.ProcessData;
import org.springframework.stereotype.Service;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.convert;

@Service
public class TemplateService {

    private final FreemarkerService freemarkerService;
    private final String baseUrl;

    public TemplateService(FreemarkerService freemarkerService, SecurityProperties securityProperties) {
        this.freemarkerService = freemarkerService;
        baseUrl = securityProperties.findBaseUrl();
    }

    public String needsRevision(List<Process> processes) {
        var processDataList = convert(processes, p -> ProcessData.builder()
                .processUrl(baseUrl + "/process/" + p.getId())
                .purposes(p.getPurposeCodeResponses())
                .name(p.getData().getName())
                .build());

        var model = NeedsRevisionModel.builder()
                .template(Template.PROCESS_NEEDS_REVISION)
                .processes(processDataList)
                .revisionText(processes.get(0).getData().getRevisionText())
                .revisionRequestedBy(MdcUtils.getUser())
                .build();

        return freemarkerService.generate(model);
    }

}
