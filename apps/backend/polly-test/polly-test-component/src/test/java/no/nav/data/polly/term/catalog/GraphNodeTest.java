package no.nav.data.polly.term.catalog;

import no.nav.data.polly.term.domain.PollyTerm;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GraphNodeTest {

    @Test
    void builder() {
        GraphNode node = GraphNode.builder()
                .id("id")
                .term("term")
                .description("desc")
                .build();

        PollyTerm pollyTerm = node.convertToPollyTerm();

        assertThat(pollyTerm.getId()).isEqualTo("id");
        assertThat(pollyTerm.getName()).isEqualTo("term");
        assertThat(pollyTerm.getDescription()).isEqualTo("desc");
    }
}