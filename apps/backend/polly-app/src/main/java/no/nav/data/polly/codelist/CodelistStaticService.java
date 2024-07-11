package no.nav.data.polly.codelist;

import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.Collection;
import java.util.List;

import static no.nav.data.common.utils.StreamUtils.convert;

@Deprecated // TODO: Skal fjernes (midlertidig hjem for alt som var static i CodelistService)
public final class CodelistStaticService {
    
    private CodelistStaticService() {}
    
    public static Codelist getCodelist(ListName listName, String code) {
        return CodelistCache.getCodelist(listName, code);
    }

    public static CodelistResponse getCodelistResponse(ListName listName, String code) {
        if (code == null) {
            return null;
        }
        Codelist codelist = getCodelist(listName, code);
        if (codelist == null) {
            return new CodelistResponse(listName, code, null, null);
        }
        return CodelistResponse.buildFrom(codelist);
    }

    public static List<Codelist> getCodelists(ListName listName) {
        return CodelistCache.getCodelist(listName);
    }

    // TODO: Snu avhengigheten innover
    public static List<CodelistResponse> getCodelistResponseList(ListName listName, Collection<String> codes) {
        return convert(codes, code -> getCodelistResponse(listName, code));
    }

    public static List<Codelist> getCodelist(ListName name) {
        return CodelistCache.getCodelist(name);
    }

    public static List<Codelist> getAll() {
        return CodelistCache.getAll();
    }

}