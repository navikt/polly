package no.nav.data.polly.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashResponse {

    private ProcessDashCount allProcesses;
    private List<ProcessDashCount> departmentProcesses;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProcessDashCount {

        private String department;
        private long processes;

        private long processesCompleted;
        private long processesInProgress;

        private long processesMissingLegalBases;
        private long processesMissingArt6;
        private long processesMissingArt9;

        private long processesUsingAllInfoTypes;

        private Counter dpia;
        private Counter profiling;
        private Counter automation;
        private Counter retention;
    }

    @JsonAutoDetect(fieldVisibility = Visibility.ANY)
    public record Counter(@JsonProperty("yes")long yes, @JsonProperty("no")long no, @JsonProperty("unknown")long unknown) {

    }
}
