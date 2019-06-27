package no.nav.data.catalog.backend.app.common.swagger;

import com.google.common.base.Predicates;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(Predicates.or(RequestHandlerSelectors.basePackage("no.nav.data.catalog.backend.app.codelist"), RequestHandlerSelectors.basePackage("no.nav.data.catalog.backend.app.informationtype"),RequestHandlerSelectors.basePackage("no.nav.data.catalog.backend.app.github") ))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {
        return new ApiInfo(
                "Data Catalog Backend",
                "Rest API for getting and posting information on Data Catalog Backend. We need a writer for this....",
                "1.0",
                "Terms of service",
                new Contact("NAV", "www.nav.no", "post@nav.no"),
                "License of API", "API license URL", Collections.emptyList());
    }
}
