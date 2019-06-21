package no.nav.data.catalog.backend.app.informationtype;

import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.policy.Policy;

import java.util.*;
import java.util.stream.Collectors;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;

public class InformationTypeESDocumentResponse {
    private String elasticsearchId;
    private Long informationTypeId;
    private String name;
    private String description;
    private Map category;
    private List<Map> producer;
    private Map system;
    private Boolean personalData;
    private List<Policy> policies;

    InformationTypeESDocumentResponse(InformationTypeESDocument informationTypeESDocument) {
        this.elasticsearchId = informationTypeESDocument.getInformationType().getElasticsearchId();
        this.informationTypeId = informationTypeESDocument.getInformationType().getId();
        this.name = informationTypeESDocument.getInformationType().getName();
        this.description = informationTypeESDocument.getInformationType().getDescription();
        this.category = getMapForCodelistItem(ListName.CATEGORY, informationTypeESDocument.getInformationType().getCategoryCode());
        this.system = getMapForCodelistItem(ListName.SYSTEM, informationTypeESDocument.getInformationType().getSystemCode());
        this.producer = getListOfMappedProducers(informationTypeESDocument.getInformationType().getProducerCode());
        this.personalData = informationTypeESDocument.getInformationType().isPersonalData();
        this.policies = informationTypeESDocument.getPolicies();
    }

    private Map<String, String> getMapForCodelistItem(ListName listName, String code) {
        return Map.of("code", code,
                "description", codelists.get(listName).get(code));
    }

    private List<Map> getListOfMappedProducers(String commaSeparatedStringOfProducerCodes) {
        List<String> listOfProducerCodes = Arrays.asList(commaSeparatedStringOfProducerCodes.split("\\s*, \\s*"));
        return listOfProducerCodes.stream()
                .map(producerCode -> getMapForCodelistItem(ListName.PRODUCER, producerCode))
                .collect(Collectors.toList());
    }

    Map<String, Object> convertToMap() {
        Map<String, Object> jsonMap = new HashMap<>();
        jsonMap.put("id", elasticsearchId);
        jsonMap.put("informationTypeId", informationTypeId);
        jsonMap.put("name", name);
        jsonMap.put("description", description);
        jsonMap.put("category", category);
        jsonMap.put("producer", producer);
        jsonMap.put("system", system);
        jsonMap.put("personalData", personalData);

        List<Map> policyMaps = new ArrayList<>();
        if (policies != null) {
            for (Policy policy : policies) {
                Map<String, Object> policyMap = policy.convertToMap();
                policyMaps.add(policyMap);
            }
            jsonMap.put("policies", policyMaps);
        }
        return jsonMap;
    }
}
