package no.nav.data.polly.process.dto;

import java.util.List;
import java.util.UUID;


public interface ProcessVeryShortResponse {

    UUID getId();

    String getName();

    int getNumber();

    List<String> getPurposes();

}
