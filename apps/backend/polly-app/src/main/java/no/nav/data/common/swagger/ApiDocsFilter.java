package no.nav.data.common.swagger;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(1)
public class ApiDocsFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (!"/v3/api-docs".equals(request.getRequestURI())) {
            chain.doFilter(request, response);
            return;
        }

        var wrapper = new ContentCachingResponseWrapper(response);
        chain.doFilter(request, wrapper);

        byte[] body = wrapper.getContentAsByteArray();
        String bodyStr = new String(body, StandardCharsets.UTF_8).trim();

        if (bodyStr.startsWith("\"") && bodyStr.endsWith("\"")) {
            String base64 = bodyStr.substring(1, bodyStr.length() - 1);
            byte[] decoded = Base64.getDecoder().decode(base64);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setContentLength(decoded.length);
            response.getOutputStream().write(decoded);
            response.getOutputStream().flush();
        } else {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            wrapper.copyBodyToResponse();
        }
    }
}
