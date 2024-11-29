package no.nav.data.common.security.azure;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.TokenExpiredException;
import no.nav.data.common.security.dto.AccessTokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static java.time.LocalDateTime.now;
import static java.util.Objects.isNull;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@Slf4j
@Component
@RequiredArgsConstructor
public class AzureTokenConsumer {

    private final RestClient azureRestClient;

    @Value("${AZURE_APP_CLIENT_ID}")
    private String clientId;

    @Value("${AZURE_APP_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${AZURE_OPENID_CONFIG_TOKEN_ENDPOINT}")
    private String azureAdTokenEndpoint;

    private Map<String, Token> tokens = new HashMap<>();

    public String getToken(String scope) {
        if (!tokens.containsKey(scope)) {
            updateToken(scope);
        }
        updateTokenIfNeeded(scope);
        return tokens.get(scope).getAccessToken();
    }

    private void updateTokenIfNeeded(String scope) {
        synchronized (this) {
            if (shouldRefresh(tokens.get(scope).getExpiry())) {
                try {
                    updateToken(scope);
                } catch (RuntimeException e) {
                    log.info("Feil fanget: {}", e.getMessage());
                    if (hasExpired(tokens.get(scope).getExpiry())) {
                        throw new TokenExpiredException("En feil oppsto ved forsøk på å refreshe AzureAD token", e);
                    }
                }
            }
        }
    }

    private boolean hasExpired(LocalDateTime expiry) {
        return isNull(expiry) || now().isAfter(expiry);
    }

    private boolean shouldRefresh(LocalDateTime expiry) {
        return isNull(expiry) || now().plusMinutes(1).isAfter(expiry);
    }

    private void updateToken(String scope) {
        var formParameters = formParameters(scope);

        var response = azureRestClient.post()
                .uri(azureAdTokenEndpoint)
                .headers(httpHeaders -> {
                    httpHeaders.setAccept(Collections.singletonList(APPLICATION_JSON));
                    httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                    httpHeaders.setBasicAuth(clientId, clientSecret);
                })
                .body(formParameters)
                .retrieve()
                .body(AccessTokenResponse.class);

        if (response != null) {
            var token = Token.builder()
                    .accessToken(response.getAccessToken())
                    .expiry(now().plusSeconds(response.getExpiresIn()))
                    .build();
            tokens.put(scope, token);
        }
    }

    private MultiValueMap<String, String> formParameters(String scope) {
        MultiValueMap<String, String> formParameters = new LinkedMultiValueMap<>();
        formParameters.add("grant_type", "client_credentials");
        formParameters.add("scope", scope);

        return formParameters;
    }

    @Getter
    @Builder
    private static class Token {

        private String accessToken;
        private LocalDateTime expiry;
    }
}
