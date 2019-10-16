package no.nav.data.catalog.backend.app.common.web;

import no.nav.data.catalog.backend.app.common.utils.Constants;
import no.nav.data.catalog.backend.app.common.utils.MdcUtils;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;
import java.util.Optional;

public class TraceHeaderRequestInterceptor implements ClientHttpRequestInterceptor {

    @Override
    public ClientHttpResponse intercept(HttpRequest req, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        String correlationId = MdcUtils.getOrGenerateCorrelationId();
        String callId = Optional.ofNullable(MdcUtils.getCallId()).orElse(correlationId);

        req.getHeaders().set(Constants.HEADER_CORRELATION_ID, correlationId);
        req.getHeaders().set(Constants.HEADER_CALL_ID, callId);
        req.getHeaders().set(Constants.HEADER_CONSUMER_ID, Constants.APP_ID);
        return execution.execute(req, body);
    }
}
