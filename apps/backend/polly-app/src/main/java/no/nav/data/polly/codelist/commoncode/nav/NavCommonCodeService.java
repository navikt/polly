package no.nav.data.polly.codelist.commoncode.nav;

import no.nav.data.polly.codelist.commoncode.CommonCodeService;
import no.nav.data.polly.codelist.commoncode.dto.CommonCodeResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.filter;

@Service
@ConditionalOnProperty("client.common-code.nav.enabled")
public class NavCommonCodeService implements CommonCodeService {

    private final NavCommonCodeClient client;
    private final NavCommonCodeProps props;

    // unknown and stateless
    private static final Set<String> ignore = Set.of("XXX", "???", "9999");

    public NavCommonCodeService(NavCommonCodeClient client, NavCommonCodeProps props) {
        this.client = client;
        this.props = props;
    }

    @Override
    public List<CommonCodeResponse> getThirdPartyCountriesOutsideEEA() {
        var allCountries = client.getCodesWithDescription(props.getCountriesCode());
        var eeaCountries = convert(client.getCodesWithDescription(props.getEeaCountriesCode()), CommonCodeResponse::getCode);
        return filter(allCountries, c -> !eeaCountries.contains(c.getCode()) && !ignore.contains(c.getCode()));
    }
}
