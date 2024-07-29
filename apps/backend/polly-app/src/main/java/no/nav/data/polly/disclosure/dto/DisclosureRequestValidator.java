package no.nav.data.polly.disclosure.dto;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DisclosureRequestValidator extends RequestValidator<DisclosureRequest> {

    private final DisclosureRepository repository;
    private final DocumentRepository documentRepository;
    private final InformationTypeRepository informationTypeRepository;
    private final ProcessRepository processRepository;

    public void validateRequest(DisclosureRequest request, boolean update) {
        initialize(List.of(request), update);
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
