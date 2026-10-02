package no.nav.data.polly.informationtype;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.utils.OptimisticLockingUtil;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.policy.domain.PolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toList;
import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@Service
@RequiredArgsConstructor
public class InformationTypeService {

    private final InformationTypeRepository repository;
    private final PolicyRepository policyRepository;
    private final DocumentRepository documentRepository;
    private final DisclosureRepository disclosureRepository;
    private final AlertService alertService;

    @Transactional
    public InformationType save(InformationTypeRequest request) {
        return saveAll(List.of(request)).get(0);
    }

    @Transactional
    public InformationType update(InformationTypeRequest request) {
        return updateAll(List.of(request)).get(0);
    }

    // TODO: Metoden trenger bedre navn. Den lagrer kun nye instanser
    @Transactional
    public List<InformationType> saveAll(List<InformationTypeRequest> requests) {
        List<InformationType> informationTypes = requests.stream().map(this::convertNew).collect(toList());
        List<InformationType> all = repository.saveAll(informationTypes);
        // Flush slik at Hibernate har satt version før responsen bygges
        repository.flush();
        all.forEach(it -> alertService.calculateEventsForInforamtionType(it.getId()));
        return all;
    }

    @Transactional
    public List<InformationType> updateAll(List<InformationTypeRequest> requests) {
        List<UUID> ids = convert(requests, InformationTypeRequest::getIdAsUUID);
        List<InformationType> informationTypes = repository.findAllById(ids);

        requests.forEach(request -> find(informationTypes, request.getIdAsUUID()).ifPresent(informationType -> convertUpdate(request, informationType)));
        List<InformationType> all = repository.saveAll(informationTypes);
        // Flush slik at Hibernate har økt version før responsen bygges
        repository.flush();
        all.forEach(it -> alertService.calculateEventsForInforamtionType(it.getId()));
        return all;
    }

    @Transactional
    public InformationType delete(UUID id) {
        InformationType infoType = repository.findById(id).orElseThrow(() -> new NotFoundException("Fant ikke id=" + id));
        if (!infoType.getPolicies().isEmpty()) {
            throw new ValidationException(String.format("InformationType %s is used by %d policie(s)", id, infoType.getPolicies().size()));
        }
        List<Document> documents = documentRepository.findByInformationTypeId(id);
        if (!documents.isEmpty()) {
            throw new ValidationException(String.format("InformationType %s is used by %d document(s)", id, documents.size()));
        }
        List<Disclosure> disclosures = disclosureRepository.findByInformationTypeId(id);
        if (!disclosures.isEmpty()) {
            throw new ValidationException(String.format("InformationType %s is used by %d disclosure(s)", id, disclosures.size()));
        }

        log.info("InformationType with id={} deleted", id);
        repository.delete(infoType);
        alertService.deleteEventsForInformationType(infoType.getId());
        return infoType;
    }

    private Optional<InformationType> find(List<InformationType> informationTypes, UUID id) {
        return informationTypes.stream().filter(informationType -> id.equals(informationType.getId())).findFirst();
    }

    private InformationType convertNew(InformationTypeRequest request) {
        return new InformationType().convertNewFromRequest(request);
    }

    private void convertUpdate(InformationTypeRequest request, InformationType informationType) {
        // Optimistisk låsing: sjekk før mapping. Hibernate øker version selv ved flush.
        OptimisticLockingUtil.checkVersion(informationType, request.getVersion());
        if (!request.getName().equals(informationType.getData().getName())) {
            long expected = policyRepository.countByInformationTypeId(request.getIdAsUUID());
            int updated = policyRepository.updateInformationTypeName(request.getIdAsUUID(), request.getName());
            // Alle kall til @Modifying må verifisere antall endrede rader
            OptimisticLockingUtil.checkRowsAffected(InformationType.class, request.getIdAsUUID(), (int) expected, updated);
        }
        informationType.convertUpdateFromRequest(request);
    }

}
