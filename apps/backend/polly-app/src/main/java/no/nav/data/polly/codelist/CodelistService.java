package no.nav.data.polly.codelist;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistRequestValidator;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Lazy(false)
@Component
@RequiredArgsConstructor
public class CodelistService implements InitializingBean {
    
    private final CodelistRepository codelistRepository;
    private final CodelistRequestValidator codelistRequestValidator; // TODO: Avhengighet utover

    @Scheduled(initialDelayString = "PT1M", fixedRateString = "PT1M")
    @Transactional
    public void refreshCache() {
        log.info("Refreshing codelist cache");
        List<Codelist> allCodelists = codelistRepository.findAll();
        CodelistCache.init(cache -> allCodelists.forEach(cache::setCode));
    }

    @Transactional
    public List<Codelist> save(List<Codelist> codelists) {
        List<Codelist> saved = codelistRepository.saveAll(codelists);
        saved.forEach(CodelistCache::set);
        return saved;
    }

    // TODO: Snu avhengigheten innover
    @Transactional
    public List<Codelist> update(List<CodelistRequest> requests) {
        List<Codelist> codelists = requests.stream()
                .map(this::updateDescriptionInRepository)
                .collect(Collectors.toList());
        List<Codelist> saved = codelistRepository.saveAll(codelists);
        saved.forEach(CodelistCache::set);
        return saved;
    }

    private Codelist updateDescriptionInRepository(CodelistRequest request) {
        Optional<Codelist> byListAndCode = codelistRepository.findByListAndCode(request.getListAsListName(), request.getCode());
        Assert.isTrue(byListAndCode.isPresent(), "item not found, should be validated");
        Codelist codelist = byListAndCode.get(); // All request are validated at this point
        codelist.setShortName(request.getShortName());
        codelist.setDescription(request.getDescription());
        return codelist;
    }

    @Transactional
    public void delete(ListName name, String code) {
        Optional<Codelist> toDelete = codelistRepository.findByListAndCode(name, code);
        if (toDelete.isEmpty()) {
            log.warn("Cannot find a codelist to delete with code={} and listName={}", code, name);
            throw new CodelistNotFoundException(String.format("Cannot find a codelist to delete with code=%s and listName=%s", code, name));
        }
        codelistRequestValidator.validateNonImmutableTypeOfCodelist(name);
        codelistRequestValidator.validateCodelistIsNotInUse(name, code);
        codelistRepository.delete(toDelete.get());
        CodelistCache.remove(name, code);
    }

    @Override
    public void afterPropertiesSet() {
        log.info("init codelist cache");
        refreshCache();
    }
}