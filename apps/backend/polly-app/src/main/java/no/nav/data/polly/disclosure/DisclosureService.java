package no.nav.data.polly.disclosure;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.utils.OptimisticLockingUtil;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DisclosureService {

    private final DisclosureRepository repository;
    private final AlertService alertService;


    @Transactional
    public Disclosure save(DisclosureRequest request) {
        // saveAndFlush → Hibernate har satt version før responsen bygges
        Disclosure disclosure = repository.saveAndFlush(new Disclosure().convertFromRequest(request));
        alertService.calculateEventsForDisclosure(disclosure.getId());
        return disclosure;
    }

    @Transactional
    public Disclosure update(DisclosureRequest request) {
        Disclosure existing = repository.findById(request.getIdAsUUID()).orElseThrow();
        OptimisticLockingUtil.checkVersion(existing, request.getVersion()); // Kaster OptimisticLockingFailureException hvis feil version 
        Disclosure disclosure = existing.convertFromRequest(request);
        alertService.calculateEventsForDisclosure(disclosure.getId());
        repository.flush(); // Vil medføre at Hibernate øker version før responsen bygges
        return disclosure;
    }

    @Transactional
    public void deleteById(UUID id) {
        repository.deleteById(id);
        alertService.deleteEventsForDisclosure(id);
    }

}
