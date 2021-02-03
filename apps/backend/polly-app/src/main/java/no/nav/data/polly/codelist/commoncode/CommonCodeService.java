package no.nav.data.polly.codelist.commoncode;

import no.nav.data.polly.codelist.commoncode.dto.CommonCodeResponse;

import java.util.List;

public interface CommonCodeService {

    CommonCodeResponse getCountry(String countryCode);

    List<CommonCodeResponse> getAllCountries();

    List<CommonCodeResponse> getThirdPartyCountriesOutsideEEA();

}
