package no.nav.data.polly.settings;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import no.nav.data.common.mail.EmailService;
import no.nav.data.common.mail.MailTask;
import no.nav.data.common.security.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "App")
@RequestMapping("/app")
@RequiredArgsConstructor
public class AppController {

    private final EmailService emailService;

    @Operation(summary = "mail test")
    @ApiResponses(value = {@ApiResponse(description = "mail")})
    @GetMapping(value = "/mail", produces = "text/html")
    public ResponseEntity<String> mail() {
        var email = SecurityUtils.getCurrentUser().orElseThrow().getEmail();
        emailService.sendMail(MailTask.builder()
                .to(email)
                .subject("test")
                .body("testbody")
                .build());
        return ResponseEntity.ok("ok");
    }
}
