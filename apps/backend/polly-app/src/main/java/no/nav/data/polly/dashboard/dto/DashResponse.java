package no.nav.data.polly.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashResponse {

    private ProcessDashCount allProcesses = new ProcessDashCount();
    private List<ProcessDashCount> departmentProcesses = new ArrayList<>();
    private List<ProcessDashCount> productAreaProcesses = new ArrayList<>();

    @JsonIgnore
    private Map<String, ProcessDashCount> dashDepartmentMap = new HashMap<>();
    @JsonIgnore
    private Map<String, ProcessDashCount> dashTeamMap = new HashMap<>();
    @JsonIgnore
    private Map<String, ProcessDashCount> dashProductAreaMap = new HashMap<>();

    public ProcessDashCount department(String department) {
        return dashDepartmentMap.computeIfAbsent(department, s -> {
            var dash = new ProcessDashCount();
            dash.setDepartment(department);
            departmentProcesses.add(dash);
            return dash;
        });
    }

    public ProcessDashCount registerTeam(String teamId, String productAreaId) {
        if (productAreaId == null) {
            return null;
        }
        return dashTeamMap.computeIfAbsent(teamId, t -> dashProductAreaMap.computeIfAbsent(productAreaId, p -> {
            var dash = new ProcessDashCount();
            dash.setProductAreaId(productAreaId);
            productAreaProcesses.add(dash);
            return dash;
        }));
    }

    public ProcessDashCount team(String team) {
        return dashTeamMap.get(team);
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(Include.NON_NULL)
    public static class ProcessDashCount {

        private String department;
        private String productAreaId;
        private long processes;
        private long dpProcesses;

        private long processesCompleted;
        private long processesInProgress;

        private long processesMissingLegalBases;
        private long processesMissingArt6;
        private long processesMissingArt9;

        private long processesUsingAllInfoTypes;

        private Counter dpia = new Counter();
        private Counter profiling = new Counter();
        private Counter automation = new Counter();
        private Counter retention = new Counter();
        private long retentionDataIncomplete;
        private Counter dataProcessor = new Counter();
        private long dataProcessorAgreementMissing;
        private Counter dataProcessorOutsideEU = new Counter();
        private long commonExternalProcessResponsible;

        public void processes() {
            processes++;
        }

        public void dpProcesses() {
            dpProcesses++;
        }

        public void processesCompleted() {
            processesCompleted++;
        }

        public void processesInProgress() {
            processesInProgress++;
        }

        public void processesMissingLegalBases() {
            processesMissingLegalBases++;
        }

        public void processesMissingArt6() {
            processesMissingArt6++;
        }

        public void processesMissingArt9() {
            processesMissingArt9++;
        }

        public void processesUsingAllInfoTypes() {
            processesUsingAllInfoTypes++;
        }

        public void retentionDataIncomplete() {
            retentionDataIncomplete++;
        }

        public void dataProcessorAgreementMissing() {
            dataProcessorAgreementMissing++;
        }

        public void commonExternalProcessResponsible() {
            commonExternalProcessResponsible++;
        }

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Counter {

        private long yes;
        private long no;
        private long unknown;

        public void yes() {
            yes++;
        }

        public void no() {
            no++;
        }

        public void unknown() {
            unknown++;
        }

    }
}
