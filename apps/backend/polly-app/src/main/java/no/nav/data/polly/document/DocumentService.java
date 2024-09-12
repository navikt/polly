package no.nav.data.polly.document;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.utils.HibernateUtils;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentData.InformationTypeUse;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.settings.SettingsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StreamUtils.convert;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository repository;
    private final InformationTypeRepository informationTypeRepository;
    private final PolicyRepository policyRepository;
    private final DisclosureRepository disclosureRepository;
    private final SettingsService settingsService;

    // TODO: Snu avhengigheten innover
    public DocumentResponse getDocumentAsResponse(UUID uuid) {
        var document = repository.findById(uuid).orElseThrow(() -> new NotFoundException("Document " + uuid + " not found"));
        DocumentResponse response = DocumentResponse.buildFrom(document);
        Map<UUID, InformationTypeShortResponse> informationTypes = getInformationTypes(document);
        response.getInformationTypes().forEach(it -> it.setInformationType(informationTypes.get(it.getInformationTypeId())));
        return response;
    }

    // TODO: Snu avhengigheten innover
    public Map<UUID, InformationTypeShortResponse> getInformationTypes(Document document) {
        return informationTypeRepository.findAllById(convert(document.getData().getInformationTypes(), InformationTypeUse::getInformationTypeId))
                .stream()
                .map(Document::convertToInformationTypeResponse)
                .collect(Collectors.toMap(InformationTypeShortResponse::getId, Function.identity()));
    }

    // TODO: Snu avhengigheten innover
    @Transactional
    public Document save(DocumentRequest request) {
        Document doc = request.convertToDocument();
        if (!request.isUpdate()) {
            doc.setId(UUID.randomUUID());
        }
        return repository.save(doc);
    }

    @Transactional
    public Document update(Document doc) {
        Document existingDoc = repository.getById(doc.getId());
        if (existingDoc == null) {
            throw new NotFoundException("Couldn't find document " + doc.getId());
        }
        // Merge...
        HibernateUtils.initialize(existingDoc); // I noen tester blir existingDoc av en eller annen grunn en detached proxy
        existingDoc.setData(doc.getData());
        // Save & return...
        return repository.save(existingDoc);
    }

    @Transactional
    public Document delete(UUID uuid) {
        var doc = repository.findById(uuid).orElseThrow(() -> new NotFoundException("Couldn't find document " + uuid));
        var disclosures = disclosureRepository.findByDocumentId(uuid.toString());
        if (!disclosures.isEmpty()) {
            throw new ValidationException(String.format("Document %s is used by %d disclosure(s)", uuid, disclosures.size()));
        }
        var policies = policyRepository.findByDocumentId(uuid);
        if (!policies.isEmpty()) {
            throw new ValidationException(String.format("Document %s is used by %d policie(s)", uuid, policies.size()));
        }
        if (uuid.toString().equals(settingsService.getSettings().getDefaultProcessDocument())) {
            throw new ValidationException("Cannot delete default process document " + uuid);
        }
        repository.delete(doc);
        return doc;
    }

}
