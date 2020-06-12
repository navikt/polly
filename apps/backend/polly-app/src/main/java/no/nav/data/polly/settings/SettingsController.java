package no.nav.data.polly.settings;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.settings.dto.Settings;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(value = "Polly Settings", tags = {"Settings"})
@RequestMapping("/settings")
public class SettingsController {

    private final SettingsService service;

    public SettingsController(SettingsService service) {
        this.service = service;
    }

    @ApiOperation(value = "Get Settings")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Settings fetched", response = Settings.class)})
    @GetMapping
    public ResponseEntity<Settings> get() {
        log.info("Received request for Settings");
        return ResponseEntity.ok(service.getSettings());
    }

    @ApiOperation(value = "Write Settings")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Settings written", response = Settings.class)})
    @PostMapping
    public ResponseEntity<Settings> write(@RequestBody Settings settings) {
        log.info("Received request to write Settings");
        return ResponseEntity.ok(service.updateSettings(settings));
    }


}
