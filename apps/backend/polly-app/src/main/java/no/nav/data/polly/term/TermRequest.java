package no.nav.data.polly.term;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;


@Data
@Builder
@FieldNameConstants
@NoArgsConstructor
@AllArgsConstructor
public class TermRequest implements RequestElement {

    private String name;
    private String description;

    @JsonIgnore
    private int requestIndex;
    @JsonIgnore
    private boolean update;

    static void initiateRequests(List<TermRequest> requests, boolean update) {
        AtomicInteger i = new AtomicInteger(1);
        requests.forEach(req -> {
            req.setUpdate(update);
            req.setRequestIndex(i.getAndIncrement());
        });
    }

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkBlank(Fields.name, name);
        validator.checkBlank(Fields.description, description);
    }
}
