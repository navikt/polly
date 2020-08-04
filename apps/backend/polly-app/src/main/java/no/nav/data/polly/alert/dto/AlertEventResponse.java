package no.nav.data.polly.alert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.polly.alert.domain.AlertEventLevel;
import no.nav.data.polly.alert.domain.AlertEventType;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.process.dto.ProcessShortResponse;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlertEventResponse {

    private UUID id;
    private ProcessShortResponse process;
    private InformationTypeShortResponse informationType;
    private DisclosureResponse disclosure;
    private AlertEventType type;
    private AlertEventLevel level;

    private ChangeStampResponse changeStamp;
}
