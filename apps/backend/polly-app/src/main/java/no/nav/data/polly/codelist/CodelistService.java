package no.nav.data.polly.codelist;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistRequestValidator;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@Lazy(false)
@Service // Likevel, tjenestene som tilbys her har state (gjennom CodelistCache)
@RequiredArgsConstructor
public class CodelistService implements InitializingBean {
    
    private final CodelistRepository codelistRepository;
    private final CodelistRequestValidator codelistRequestValidator; // TODO: Avhengighet utover

    // TODO: Denne skal ikke være static
    public static Codelist getCodelist(ListName listName, String code) {
        return CodelistCache.getCodelist(listName, code);
    }

    // TODO: Snu avhengigheten innover
    // TODO: Denne skal ikke være static
    public static CodelistResponse getCodelistResponse(ListName listName, String code) {
        if (code == null) {
            return null;
        }
        Codelist codelist = getCodelist(listName, code);
        if (codelist == null) {
            return new CodelistResponse(listName, code, null, null);
        }
        return codelist.convertToResponse();
    }

    // TODO: Snu avhengigheten innover
    // TODO: Denne skal ikke være static
    public static List<CodelistResponse> getCodelistResponseList(ListName listName) {
        return convert(CodelistCache.getCodelist(listName), Codelist::convertToResponse);
    }

    // TODO: Snu avhengigheten innover
    // TODO: Denne skal ikke være static
    public static List<CodelistResponse> getCodelistResponseList(ListName listName, Collection<String> codes) {
        return convert(codes, code -> getCodelistResponse(listName, code));
    }

    // TODO: Denne skal ikke være static
    public static List<Codelist> getCodelist(ListName name) {
        return CodelistCache.getCodelist(name);
    }

    // TODO: Denne skal ikke være static
    public static List<Codelist> getAll() {
        return CodelistCache.getAll();
    }

    @Scheduled(initialDelayString = "PT1M", fixedRateString = "PT1M")
    @Transactional
    public void refreshCache() {
        log.info("Refreshing codelist cache");
        List<Codelist> allCodelists = codelistRepository.findAll();
        CodelistCache.init(cache -> allCodelists.forEach(cache::setCode));
    }

    // TODO: Snu avhengigheten innover
    @Transactional
    public List<Codelist> save(List<CodelistRequest> requests) {
        List<Codelist> codelists = requests.stream()
                .map(CodelistRequest::convert)
                .collect(Collectors.toList());
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