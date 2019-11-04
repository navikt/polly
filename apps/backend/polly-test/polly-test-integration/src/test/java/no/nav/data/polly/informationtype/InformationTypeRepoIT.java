package no.nav.data.polly.informationtype;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
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
                .elasticsearchStatus(ElasticsearchStatus.SYNCED)
                .data(InformationTypeData.builder()
                        .name("name")
                        .description("desc")
                        .pii(true)
                        .sensitivity("much")
                        .category("cat")
                        .source("source")
                        .keyword("keyword")
                        .build()
                )
                .build();

        informationTypeRepository.saveAndFlush(type);

        Optional<InformationType> byName = informationTypeRepository.findByName("name");
        assertThat(byName).isPresent();
    }
}
