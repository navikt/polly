package no.nav.data.polly.term;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TermRequest {

    private String name;
    private String description;

    @JsonIgnore
    private int requestId;
    @JsonIgnore
    private boolean update;

    public static void initiateRequests(List<TermRequest> requests, boolean update) {
        AtomicInteger i = new AtomicInteger(1);
        requests.forEach(req -> {
            req.setUpdate(update);
            req.setRequestId(i.getAndIncrement());
        });
    }
}
