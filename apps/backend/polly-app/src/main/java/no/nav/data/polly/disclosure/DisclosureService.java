package no.nav.data.polly.disclosure;

import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DisclosureService extends RequestValidator<DisclosureRequest> {

    // TODO: Denne klassen skal ikke subklasse RequestValidator. Flytt dette ut til en egen komponent (XxxRequestValidator). 

    private final DisclosureRepository repository;
    private final DocumentRepository documentRepository;
    private final InformationTypeRepository informationTypeRepository;
    private final ProcessRepository processRepository;
    private final AlertService alertService;


    public DisclosureService(DisclosureRepository repository, DocumentRepository documentRepository,
            InformationTypeRepository informationTypeRepository, ProcessRepository processRepository, AlertService alertService) {
        this.repository = repository;
        this.documentRepository = documentRepository;
        this.informationTypeRepository = informationTypeRepository;
        this.processRepository = processRepository;
        this.alertService = alertService;
    }

    @Transactional
    public Disclosure save(DisclosureRequest request) {
        initialize(List.of(request), false);
        validateRequest(request);
        Disclosure disclosure = repository.save(new Disclosure().convertFromRequest(request));
        alertService.calculateEventsForDisclosure(disclosure.getId());
        return disclosure;
    }

    @Transactional
    public Disclosure update(DisclosureRequest request) {
        initialize(List.of(request), true);
        validateRequest(request);
        Disclosure disclosure = repository.findById(request.getIdAsUUID()).orElseThrow().convertFromRequest(request);
        alertService.calculateEventsForDisclosure(disclosure.getId());
        return disclosure;
    }

    @Transactional
    public void deleteById(UUID id) {
        repository.deleteById(id);
        alertService.deleteEventsForDisclosure(id);
    }

    private void validateRequest(DisclosureRequest request) {
        var validationErrors = StreamUtils.applyAll(request,
                RequestElement::validateFields,
                r -> validateRepositoryValues(r, r.getIdAsUUID() != null && repository.findById(r.getIdAsUUID()).isPresent()),
                r -> validateObject(r.getDocumentId(), documentRepository::findById, r.getReference(), "document"),
                r -> validateObjects(r.getProcessIds(), processRepository::findAllById, r.getReference(), "process"),
                r -> validateObjects(r.getInformationTypeIds(), informationTypeRepository::findAllById, r.getReference(), "informationType")
        );

        ifErrorsThrowValidationException(validationErrors);
    }
}
