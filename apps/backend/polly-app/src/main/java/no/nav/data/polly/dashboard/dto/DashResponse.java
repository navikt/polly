package no.nav.data.polly.dashboard.dto;

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
    private List<ProcessDepartmentDashCount> departmentProcesses;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProcessDashCount {

        private long processes;

        private long processesCompleted;
        private long processesInProgress;

        private long processesMissingLegalBases;

        private long processesUsingAllInfoTypes;
        private long processesWithDpia;
        private long processesUnknownDpia;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProcessDepartmentDashCount {

        private String department;
        private long processes;

        private long processesCompleted;
        private long processesInProgress;

        private long processesMissingLegalBases;

    }
}
