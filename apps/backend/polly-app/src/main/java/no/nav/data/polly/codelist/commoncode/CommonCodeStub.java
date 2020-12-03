package no.nav.data.polly.codelist.commoncode;

import no.nav.data.polly.codelist.commoncode.dto.CommonCodeResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@ConditionalOnMissingBean(CommonCodeService.class)
public class CommonCodeStub implements CommonCodeService {

    @Override
    public List<CommonCodeResponse> getAllCountries() {
        return List.of();
    }

    @Override
    public List<CommonCodeResponse> getThirdPartyCountriesOutsideEEA() {
        return List.of();
    }
}
