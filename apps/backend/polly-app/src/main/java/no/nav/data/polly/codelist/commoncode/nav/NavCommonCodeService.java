package no.nav.data.polly.codelist.commoncode.nav;

import no.nav.data.polly.codelist.commoncode.CommonCodeService;
import no.nav.data.polly.codelist.commoncode.dto.CommonCodeResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.filter;

@Service
@ConditionalOnProperty("client.common-code.nav.enabled")
public class NavCommonCodeService implements CommonCodeService {

    private final NavCommonCodeClient client;
    private final NavCommonCodeProps props;

    // unknown and stateless
    private static final Set<String> ignore = Set.of("XXX");
    private static final Pattern VALID_PATTERN = Pattern.compile("[A-Z]{3}");

    public NavCommonCodeService(NavCommonCodeClient client, NavCommonCodeProps props) {
        this.client = client;
        this.props = props;
    }

    @Override
    public List<CommonCodeResponse> getAllCountries() {
        return client.getCodesWithDescription(props.getCountriesCode());
    }

    @Override
    public List<CommonCodeResponse> getThirdPartyCountriesOutsideEEA() {
        var allCountries = getAllCountries();
        var eeaCountries = convert(client.getCodesWithDescription(props.getEeaCountriesCode()), CommonCodeResponse::getCode);
        return filter(allCountries, c -> !eeaCountries.contains(c.getCode()) && !ignore.contains(c.getCode()) && VALID_PATTERN.matcher(c.getCode()).matches());
    }
}
