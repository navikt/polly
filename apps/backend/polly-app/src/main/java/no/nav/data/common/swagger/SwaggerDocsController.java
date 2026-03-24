package no.nav.data.common.swagger;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class SwaggerDocsController {

    @GetMapping(value = "/swagger-ui/swagger-initializer.js", produces = "application/javascript")
    @ResponseBody
    public String swaggerInitializer() {
        return """
                window.onload = function() {
                  window.ui = SwaggerUIBundle({
                    url: "/v3/api-docs",
                    dom_id: '#swagger-ui',
                    presets: [
                      SwaggerUIBundle.presets.apis,
                      SwaggerUIStandalonePreset
                    ],
                    layout: "StandaloneLayout",
                    validatorUrl: ""
                  });
                };
                """;
    }
}

