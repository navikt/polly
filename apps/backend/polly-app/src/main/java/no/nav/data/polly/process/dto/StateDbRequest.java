package no.nav.data.polly.process.dto;

import java.util.List;

import org.springframework.lang.Nullable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;

@Data
@Builder
@AllArgsConstructor
public class StateDbRequest {

    private final ProcessField processField;
    private final ProcessState processState;
    @Nullable
    private final String department;
    private final boolean noDepartment;
    @Nullable
    private final String seksjonId;
    @Nullable
    private final List<String> teamIds;
    @Nullable
    private final ProcessStatus status;

}
