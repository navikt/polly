package no.nav.data.polly.term.catalog;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.term.domain.PollyTerm;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GraphNode {

    private static final String TERM_NAME_PROP = "term";
    private static final String DESC_PROP = "definisjon";

    private String id;
    private String guid;
    @JsonProperty("prop_id")
    private String propId;
    private String created;
    private JsonNode prop;

    public PollyTerm convertToPollyTerm() {
        return PollyTerm.builder()
                .id(propId)
                .name(prop.get(TERM_NAME_PROP).textValue())
                .description(prop.get(DESC_PROP).textValue())
                .build();
    }

    public static class GraphNodeBuilder {

        private static final JsonNodeFactory jf = JsonNodeFactory.instance;

        private ObjectNode prop = jf.objectNode();

        public GraphNodeBuilder term(String term) {
            prop.set(TERM_NAME_PROP, jf.textNode(term));
            return this;
        }

        public GraphNodeBuilder description(String description) {
            prop.set(DESC_PROP, jf.textNode(description));
            return this;
        }
    }
}
