package no.nav.data.polly.process.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import org.springframework.lang.Nullable;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class StateDbRequest {

    private final ProcessField processField;
    private final ProcessState processState;
    @Nullable
    private final String department;
    @Nullable
    private final List<String> teamIds;
    @Nullable
    private final ProcessStatus status;

}
