package no.nav.data.common.template;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.security.SecurityProperties;
import no.nav.data.common.utils.MdcUtils;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class TemplateServiceTest {

    private TemplateService templateService;

    @BeforeEach
    void setUp() {
        var freemarkerService = new FreemarkerConfig().freemarkerService();
        SecurityProperties securityProperties = new SecurityProperties();
        securityProperties.setRedirectUris(List.of("http://baseurl"));
        templateService = new TemplateService(freemarkerService, securityProperties);
    }

    @Test
    void needsRevisionTemplate() {
        CodelistStub.initializeCodelist();
        MdcUtils.setUser("S123456 - Name Nameson");

        var html = templateService.needsRevision(List.of(
                Process.builder()
                        .generateId()
                        .data(ProcessData.builder()
                                .purpose("KONTROLL")
                                .name("name 1")
                                .revisionText("revision is needed")
                                .build())
                        .build(),
                Process.builder()
                        .generateId()
                        .data(ProcessData.builder()
                                .purpose("AAP")
                                .name("name 2")
                                .revisionText("revision is needed")
                                .build())
                        .build()
        ));

        assertThat(html).isNotNull();

        log.info(html);
    }
}