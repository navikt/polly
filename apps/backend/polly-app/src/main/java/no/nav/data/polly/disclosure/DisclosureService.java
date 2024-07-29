package no.nav.data.polly.disclosure;

import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class DisclosureService {

    private final DisclosureRepository repository;
    private final AlertService alertService;


    @Transactional
    public Disclosure save(DisclosureRequest request) {
        Disclosure disclosure = repository.save(new Disclosure().convertFromRequest(request));
        alertService.calculateEventsForDisclosure(disclosure.getId());
        return disclosure;
    }

    @Transactional
    public Disclosure update(DisclosureRequest request) {
        Disclosure disclosure = repository.findById(request.getIdAsUUID()).orElseThrow().convertFromRequest(request);
        alertService.calculateEventsForDisclosure(disclosure.getId());
        return disclosure;
    }

    @Transactional
    public void deleteById(UUID id) {
        repository.deleteById(id);
        alertService.deleteEventsForDisclosure(id);
    }

}
