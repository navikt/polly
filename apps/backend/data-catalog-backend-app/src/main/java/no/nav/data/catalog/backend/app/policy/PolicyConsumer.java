package no.nav.data.catalog.backend.app.policy;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
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
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PolicyConsumer {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${datacatalog.policy.url}")
    private String policyUrl;

    public List<Policy> getPolicyForInformationType(Long informationTypeId) {
        if (informationTypeId == null) return null;
        try {
            ResponseEntity<List<PolicyResponse>> responseEntity = restTemplate.exchange(policyUrl + "?informationTypeId=" + informationTypeId, HttpMethod.GET,  HttpEntity.EMPTY, new ParameterizedTypeReference<List<PolicyResponse>>() {});
            return responseEntity.getBody().stream().map(reponse -> new Policy().convertFromResponse(reponse)).collect(Collectors.toList());
        } catch (
                HttpClientErrorException e) {
            if (HttpStatus.NOT_FOUND.equals(e.getStatusCode())) {
                throw new DataCatalogBackendNotFoundException(String.format("Policies for InformationType (id: %s) does not exist", informationTypeId));
            } else {
                throw new DataCatalogBackendTechnicalException(String.format("Getting Policies for InformationTyp (id: %s) failed with status=%s message=%s", informationTypeId, e.getStatusCode(), e.getResponseBodyAsString()), e, e.getStatusCode());
            }
        } catch (HttpServerErrorException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Getting Policies for InformationType (id: %s) failed with status=%s message=%s", informationTypeId, e.getStatusCode(), e.getResponseBodyAsString()), e, e.getStatusCode());
        }
    }
}
