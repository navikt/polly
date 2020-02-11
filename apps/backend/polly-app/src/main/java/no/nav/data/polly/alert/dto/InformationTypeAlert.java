package no.nav.data.polly.alert.dto;

import lombok.Value;

import java.util.List;
import java.util.UUID;

@Value
public class InformationTypeAlert {

    private UUID informationTypeId;
    private List<ProcessAlert> processes;
}
