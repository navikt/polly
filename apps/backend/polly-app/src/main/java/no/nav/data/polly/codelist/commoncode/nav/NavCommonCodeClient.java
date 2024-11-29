package no.nav.data.polly.codelist.commoncode.nav;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import no.nav.data.common.security.azure.AzureTokenConsumer;
import no.nav.data.common.utils.MetricUtils;
import no.nav.data.polly.codelist.commoncode.dto.CommonCodeResponse;
import no.nav.data.polly.codelist.commoncode.nav.dto.CommonCode;
import no.nav.data.polly.codelist.commoncode.nav.dto.CommonCodeList;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.util.UUID.randomUUID;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.find;

@Service
public class NavCommonCodeClient {

    private final RestTemplate restTemplate;
    private final NavCommonCodeProps props;
    private final AzureTokenConsumer azureTokenConsumer;

    private final LoadingCache<String, List<CommonCodeResponse>> cache;

    @Value("${app.name}")
    private String appName;

    @Value("${app.scope.kodeverk}")
    private String kodeverkScope;

    @Value("${polly.security.client.enabled}")
    private boolean tokenedHeader;

    public NavCommonCodeClient(RestTemplate restTemplate, NavCommonCodeProps props, AzureTokenConsumer azureTokenConsumer) {
        this.restTemplate = restTemplate;
        this.props = props;
        this.azureTokenConsumer = azureTokenConsumer;
        this.cache = Caffeine.newBuilder().recordStats()
                .expireAfterWrite(Duration.ofMinutes(10))
                .maximumSize(100).build(this::getCodeList);
        MetricUtils.register("commonCodeCache", cache);
    }

    public List<String> getCodes(String codeName) {
        return convert(cache.get(codeName), CommonCodeResponse::getCode);
    }

    public List<CommonCodeResponse> getCodesWithDescription(String codeName) {
        return cache.get(codeName);
    }

    public CommonCodeResponse getCode(String codeName, String code) {
        return find(cache.get(codeName), c -> c.getCode().equals(code)).orElse(null);
    }

    private List<CommonCodeResponse> getCodeList(String codeName) {
        var headers = new HttpHeaders();
        headers.set("Nav-Call-Id", randomUUID().toString());
        headers.set("Nav-Consumer-Id", appName);
        if(tokenedHeader) {
            headers.setBearerAuth(azureTokenConsumer.getToken(kodeverkScope));
        }

        var resp = restTemplate.exchange(props.getGetWithTextUrl(), HttpMethod.GET, new HttpEntity<>(headers), CommonCodeList.class, codeName, props.getLang());
        Assert.notNull(resp.getBody(), "No response from common-code");
        return resp.getBody()
                .getBetydninger().entrySet()
                .stream().map(e -> {
                    String code = e.getKey();
                    if (e.getValue() == null || e.getValue().isEmpty()) {
                        return null;
                    }
                    CommonCode cc = e.getValue().get(0);
                    var desc = cc.getBeskrivelser().get(props.getLang());
                    return CommonCodeResponse.builder()
                            .code(code)
                            .description(desc.getTekst())
                            .validFrom(cc.getGyldigFra())
                            .validTo(cc.getGyldigTil())
                            .build();
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(CommonCodeResponse::getCode))
                .collect(Collectors.toList());
    }
}
