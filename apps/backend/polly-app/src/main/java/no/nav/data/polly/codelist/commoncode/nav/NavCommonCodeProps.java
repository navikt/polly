package no.nav.data.polly.codelist.commoncode.nav;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("client.common-code.nav")
@Data
public class NavCommonCodeProps {

    private boolean enabled  = true;
    private String getWithTextUrl;
    private String countriesCode;
    private String eeaCountriesCode;
    private String lang;

}
