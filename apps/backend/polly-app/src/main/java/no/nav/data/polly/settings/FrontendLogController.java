package no.nav.data.polly.settings;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.utils.JsonUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(value = "Polly frontend logging", tags = {"Logging"})
@RequestMapping("/frontendlog")
public class FrontendLogController {

    @ApiOperation(value = "Write log")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Log written")})
    @PostMapping
    public void write(@RequestBody LogRequest request) {
        var string = JsonUtils.toJson(request);
        switch (request.level) {
            case info -> log.info(string);
            case warn -> log.warn(string);
            case error -> log.error(string);
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LogRequest {

        public enum Level {info, warn, error}

        private Level level;
        private String context;
        private String content;

    }

}
