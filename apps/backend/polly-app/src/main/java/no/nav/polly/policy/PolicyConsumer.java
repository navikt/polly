package no.nav.polly.policy;

import lombok.extern.slf4j.Slf4j;
import no.nav.polly.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.polly.common.rest.RestResponsePage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.util.Collections.emptyList;

@Slf4j
@Component
public class PolicyConsumer {

    private static final ParameterizedTypeReference<RestResponsePage<PolicyResponse>> RESPONSE_TYPE = new ParameterizedTypeReference<>() {
    };

    @Autowired
    private RestTemplate restTemplate;

    @Value("${datacatalog.policy.url}")
    private String policyUrl;

    public List<PolicyResponse> getPolicyForDataset(UUID datasetId) {
        if (datasetId == null) {
            return emptyList();
        }
        try {
            ResponseEntity<RestResponsePage<PolicyResponse>> responseEntity = restTemplate
                    .exchange(policyUrl + "?datasetId={id}", HttpMethod.GET, HttpEntity.EMPTY, RESPONSE_TYPE, datasetId);
            if (responseEntity.getBody().getContent() != null) {
                return new ArrayList<>(responseEntity.getBody().getContent());
            } else {
                log.warn("policy response without content");
                return emptyList();
            }
        } catch (HttpClientErrorException e) {
            if (HttpStatus.NOT_FOUND.equals(e.getStatusCode())) {
                return emptyList();
            } else {
                return throwException(datasetId, e);
            }
        } catch (HttpServerErrorException e) {
            return throwException(datasetId, e);
        }
    }

    public void deletePoliciesForDataset(UUID id) {
        log.info("Deleting policies for datasetId={}", id);
        restTemplate.delete(UriComponentsBuilder.fromHttpUrl(policyUrl).queryParam("datasetId", id.toString()).build().toUri());
    }

    private List<PolicyResponse> throwException(UUID datasetId, HttpStatusCodeException e) {
        String message = String.format("Getting Policies for Dataset (id: %s) failed with status=%s message=%s", datasetId, e.getStatusCode(), e.getResponseBodyAsString());
        throw new DataCatalogBackendTechnicalException(message, e, e.getStatusCode());
    }
}
