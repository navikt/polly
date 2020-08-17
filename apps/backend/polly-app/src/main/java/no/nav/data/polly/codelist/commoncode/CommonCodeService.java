package no.nav.data.polly.codelist.commoncode;

import no.nav.data.polly.codelist.commoncode.dto.CommonCodeResponse;

import java.util.List;

public interface CommonCodeService {

    List<CommonCodeResponse> getThirdPartyCountriesOutsideEEA();

}
