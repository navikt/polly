package no.nav.data.polly.codelist;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Slf4j
@Service
public class CodelistService extends RequestValidator<CodelistRequest> {

    private CodelistRepository codelistRepository;

    public CodelistService(CodelistRepository codelistRepository) {
        this.codelistRepository = codelistRepository;
    }

    public static Codelist getCodelist(ListName listName, String code) {
        return CodelistCache.getCodelist(listName, code);
    }

    public static CodeResponse getCodeResponseForCodelistItem(ListName listName, String code) {
        Codelist codelist = getCodelist(listName, code);
        if (codelist == null) {
            return new CodeResponse(code, null);
        }
        return new CodeResponse(codelist.getCode(), codelist.getDescription());
    }

    public static List<CodeResponse> getCodeResponseForCodelistItems(ListName listName, Collection<String> codes) {
        return safeStream(codes)
                .map(code -> getCodeResponseForCodelistItem(listName, code))
                .collect(Collectors.toList());
    }

    public static List<String> format(ListName listName, List<String> codes) {
        return convert(codes, code -> format(listName, code));
    }

    public static String format(ListName listName, String code) {
        if (code == null) {
            return null;
        }
        Codelist codelist = getCodelist(listName, code);
        Assert.notNull(codelist, "Code " + listName + " " + code + " does not exist");
        return codelist.getCode();
    }

    @PostConstruct
    public void refreshCache() {
        List<Codelist> allCodelists = codelistRepository.findAll();
        CodelistCache.init();
        allCodelists.forEach(CodelistCache::set);
    }

    public List<Codelist> save(List<CodelistRequest> requests) {
        List<Codelist> codelists = requests.stream()
                .map(CodelistRequest::convert)
                .collect(Collectors.toList());
        List<Codelist> saved = codelistRepository.saveAll(codelists);
        saved.forEach(CodelistCache::set);
        return saved;
    }

    public List<Codelist> update(List<CodelistRequest> requests) {
        List<Codelist> codelists = requests.stream()
                .map(this::updateDescriptionInRepository)
                .collect(Collectors.toList());

        List<Codelist> saved = codelistRepository.saveAll(codelists);
        saved.forEach(CodelistCache::set);
        return saved;
    }

    private Codelist updateDescriptionInRepository(CodelistRequest request) {
        Optional<Codelist> optionalCodelist = codelistRepository.findByListAndNormalizedCode(request.getListAsListName(), request.getNormalizedCode());
        if (optionalCodelist.isPresent()) {
            Codelist codelist = optionalCodelist.get();
            codelist.setDescription(request.getDescription());
            return codelist;
        }
        log.error("Cannot find codelist with code={} in list={}", request.getCode(), request.getList());
        throw new CodelistNotFoundException(String.format(
                "Cannot find codelist with code=%s in list=%s", request.getCode(), request.getList()));
    }

    public void delete(ListName name, String code) {
        Optional<Codelist> toDelete = codelistRepository.findByListAndNormalizedCode(name, Codelist.normalize(code));
        if (toDelete.isPresent()) {
            codelistRepository.delete(toDelete.get());
            CodelistCache.remove(name, code);
        } else {
            log.error("Cannot find a codelist to delete with code={} and listName={}", code, name);
            throw new IllegalArgumentException(
                    String.format("Cannot find a codelist to delete with code=%s and listName=%s", code, name));
        }
    }

    public void validateListNameExists(String listName) {
        if (nonValidListName(listName)) {
            log.error("Codelist with listName={} does not exits", listName);
            throw new CodelistNotFoundException(String.format("Codelist with listName=%s does not exist", listName));
        }
    }

    public void validateListNameAndCodeExists(String listName, String code) {
        validateListNameExists(listName);
        if (!CodelistCache.contains(ListName.valueOf(listName.toUpperCase()), code)) {
            log.error("The code={} does not exist in the list={}.", code, listName);
            throw new CodelistNotFoundException(String.format("The code=%s does not exist in the list=%s.", code, listName));
        }
    }

    private boolean nonValidListName(String listName) {
        Optional<ListName> optionalListName = Arrays.stream(ListName.values())
                .filter(x -> x.toString().equalsIgnoreCase(listName))
                .findFirst();
        return optionalListName.isEmpty();
    }

    public void validateRequest(List<CodelistRequest> requests, boolean update) {
        initialize(requests, update);

        var validationErrors = validateNoDuplicates(requests);
        requests.forEach(CodelistRequest::format);

        validationErrors.addAll(StreamUtils.applyAll(requests,
                RequestElement::validateFields,
                req -> validateRepositoryValues(req, codelistRepository.findByListAndNormalizedCode(req.getListAsListName(), req.getCode()).isPresent())
        ));

        checkForErrors(validationErrors);
    }

}