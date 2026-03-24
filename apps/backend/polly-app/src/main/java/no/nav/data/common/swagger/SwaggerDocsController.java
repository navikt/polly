package no.nav.data.common.swagger;

import java.io.IOException;

import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;

@Component
@Order(1)
public class SwaggerDocsController extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if ("/v3/api-docs".equals(request.getRequestURI())) {
            chain.doFilter(request, new HttpServletResponseWrapper(response) {
                @Override
                public void setContentType(String type) {
                    super.setContentType(MediaType.APPLICATION_JSON_VALUE);
                }

                @Override
                public void setHeader(String name, String value) {
                    if ("Content-Type".equalsIgnoreCase(name)) {
                        super.setHeader(name, MediaType.APPLICATION_JSON_VALUE);
                    } else {
                        super.setHeader(name, value);
                    }
                }
            });
        } else {
            chain.doFilter(request, response);
        }
    }
}
