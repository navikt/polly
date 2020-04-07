package no.nav.data.polly.alert.dto;

import lombok.Value;

import java.util.List;
import java.util.UUID;

@Value
public class InformationTypeAlert {

    UUID informationTypeId;
    List<ProcessAlert> processes;
}
