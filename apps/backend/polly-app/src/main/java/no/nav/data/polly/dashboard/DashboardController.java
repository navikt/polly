package no.nav.data.polly.dashboard;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.dashboard.dto.DashResponse;
import no.nav.data.polly.dashboard.dto.DashResponse.ProcessDashCount;
import no.nav.data.polly.dashboard.dto.DashResponse.ProcessDepartmentDashCount;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.domain.ProcessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

import static no.nav.data.polly.process.domain.ProcessCount.countToMap;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/dash")
@Api(value = "Dashboard", tags = {"Dashboard"})
public class DashboardController {

    private final ProcessRepository processRepository;

    public DashboardController(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    @ApiOperation(value = "Get Dashboard data")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Data fetched", response = DashResponse.class),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping
    public ResponseEntity<DashResponse> getDashoboardData() {
        ListName department = ListName.DEPARTMENT;
        var processCounts = countToMap(processRepository.countDepartmentCode(), department);
        var depComplete = countToMap(processRepository.countDepartmentCodeStatus(ProcessStatus.COMPLETED), department);
        var depInProg = countToMap(processRepository.countDepartmentCodeStatus(ProcessStatus.IN_PROGRESS), department);

        var byDepartment = processCounts.entrySet().stream().map(e -> ProcessDepartmentDashCount.builder()
                .department(e.getKey())
                .processes(e.getValue())
                .processesCompleted(depComplete.get(e.getKey()))
                .processesInProgress(depInProg.get(e.getKey()))
                .build()).collect(Collectors.toList());

        var dash = DashResponse.builder()
                .allProcesses(ProcessDashCount.builder()
                        .processes(processRepository.count())
                        .processesCompleted(processRepository.countStatus(ProcessStatus.COMPLETED))
                        .processesInProgress(processRepository.countStatus(ProcessStatus.IN_PROGRESS))
                        .processesUsingAllInfoTypes(processRepository.countUsingAllInfoTypes())
                        .processesWithDpia(processRepository.countWithDpia())
                        .processesUnknownDpia(processRepository.countUnknownDpia())
                        .build())
                .departmentProcesses(byDepartment)
                .build();
        return ResponseEntity.ok(dash);
    }
}
