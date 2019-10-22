package no.nav.data.polly.informationtype;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.elasticsearch.ElasticsearchStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class InformationTypeRepoIT extends IntegrationTestBase {

    @Autowired
    private InformationTypeRepository informationTypeRepository;

    @Test
    void save() {
        InformationType type = InformationType.builder()
                .generateId()
                .name("name")
                .description("desc")
                .category("cat")
                .pii("oh yes")
                .sensitivity("much")
                .build()
                .addContext(Context.builder()
                        .generateId()
                        .name("cname")
                        .elasticsearchStatus(ElasticsearchStatus.SYNCED)
                        .description("cdesc")
                        .source("source")
                        .keyword("keyword")
                        .build()
                );

        informationTypeRepository.saveAndFlush(type);

        Optional<InformationType> byName = informationTypeRepository.findByName("name");
        assertThat(byName).isPresent();
    }
}
