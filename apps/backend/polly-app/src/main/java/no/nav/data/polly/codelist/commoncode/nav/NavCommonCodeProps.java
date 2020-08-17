package no.nav.data.polly.codelist.commoncode.nav;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("client.common-code.nav")
@Data
@Slf4j
public class NavCommonCodeProps {

    private String getWithTextUrl;
    private String countriesCode;
    private String eeaCountriesCode;
    private String lang;

}
