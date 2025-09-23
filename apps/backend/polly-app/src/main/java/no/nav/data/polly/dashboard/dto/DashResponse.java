package no.nav.data.polly.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.C;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashResponse {

    @Builder.Default
    private DashCount all = new DashCount();
    @Builder.Default
    private List<DashCount> departments = new ArrayList<>();
    @Builder.Default
    private List<DashCount> productAreas = new ArrayList<>();

    @JsonIgnore
    @Builder.Default
    private Map<String, DashCount> dashDepartmentMap = new HashMap<>();
    @JsonIgnore
    @Builder.Default
    private Map<String, DashCount> dashTeamMap = new HashMap<>();
    @JsonIgnore
    @Builder.Default
    private Map<String, DashCount> dashProductAreaMap = new HashMap<>();

    public DashCount department(String department) {
        return dashDepartmentMap.computeIfAbsent(department, s -> {
            var dash = new DashCount();
            dash.setDepartment(department);
            departments.add(dash);
            return dash;
        });
    }

    public DashCount registerTeam(String teamId, String productAreaId) {
        if (productAreaId == null) {
            return null;
        }
        return dashTeamMap.computeIfAbsent(teamId, t -> dashProductAreaMap.computeIfAbsent(productAreaId, p -> {
            var dash = new DashCount();
            dash.setProductAreaId(productAreaId);
            productAreas.add(dash);
            return dash;
        }));
    }

    public DashCount team(String team) {
        return dashTeamMap.get(team);
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(Include.NON_NULL)
    public static class DashCount {

        private String department;
        private String productAreaId;
        private long processes;
        private long dpProcesses;

        private long disclosures;
        private long disclosuresIncomplete;

        private long processesCompleted;
        private long processesInProgress;
        private long processesNeedsRevision;

        private long processesMissingLegalBases;
        private long processesMissingArt6;
        private long processesMissingArt9;

        private long processesUsingAllInfoTypes;

        @Builder.Default
        private Counter aiUsage = new Counter();
        @Builder.Default
        private Counter dpia = new Counter();
        private long dpiaReferenceMissing;
        @Builder.Default
        private Counter profiling = new Counter();
        @Builder.Default
        private Counter automation = new Counter();
        @Builder.Default
        private Counter retention = new Counter();
        private long retentionDataIncomplete;
        @Builder.Default
        private Counter dataProcessor = new Counter();
        private long commonExternalProcessResponsible;

        public void processes() {
            processes++;
        }

        public void dpProcesses() {
            dpProcesses++;
        }

        public void disclosures() {
            disclosures++;
        }

        public void disclosuresIncomplete() {
            disclosuresIncomplete++;
        }

        public void processesCompleted() {
            processesCompleted++;
        }

        public void processesInProgress() {
            processesInProgress++;
        }

        public void processesNeedsRevision() {
            processesNeedsRevision++;
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

        public void dpiaReferenceMissing() {
            dpiaReferenceMissing++;
        }

        public void retentionDataIncomplete() {
            retentionDataIncomplete++;
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
