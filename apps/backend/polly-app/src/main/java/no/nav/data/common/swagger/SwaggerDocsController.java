package no.nav.data.common.swagger;

import org.springdoc.webmvc.api.OpenApiWebMvcResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Hidden
@RestController
@RequiredArgsConstructor
public class SwaggerDocsController {

    private final OpenApiWebMvcResource openApiWebMvcResource;

    @GetMapping(value = "/v3/api-docs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<byte[]> apiDocs(HttpServletRequest request) throws Exception {
        byte[] body = openApiWebMvcResource.openapiJson(request, "/v3/api-docs", java.util.Locale.getDefault());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }
}
