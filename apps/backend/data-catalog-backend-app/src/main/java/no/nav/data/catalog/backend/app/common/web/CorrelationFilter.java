package no.nav.data.catalog.backend.app.common.web;

import no.nav.data.catalog.backend.app.common.utils.MdcUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static no.nav.data.catalog.backend.app.common.utils.Constants.NAV_CALL_ID;
import static no.nav.data.catalog.backend.app.common.utils.Constants.NAV_CONSUMER_ID;
import static no.nav.data.catalog.backend.app.common.utils.Constants.NAV_CORRELATION_ID;

public class CorrelationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Optional.ofNullable(request.getHeader(NAV_CALL_ID))
                .or(() -> Optional.ofNullable(request.getHeader(NAV_CORRELATION_ID)))
                .ifPresent(MdcUtils::setCallId);

        Optional.ofNullable(request.getHeader(NAV_CONSUMER_ID)).ifPresent(MdcUtils::setConsumerId);

        MdcUtils.createCorrelationId();
        try {
            filterChain.doFilter(request, response);
        } finally {
            MdcUtils.clearCorrelationId();
            MdcUtils.clearCallId();
            MdcUtils.clearConsumer();
        }
    }
}
