package no.nav.data.polly.codelist.commoncode.nav;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import no.nav.data.common.utils.MetricUtils;
import no.nav.data.polly.codelist.commoncode.dto.CommonCodeResponse;
import no.nav.data.polly.codelist.commoncode.nav.dto.CommonCode;
import no.nav.data.polly.codelist.commoncode.nav.dto.CommonCodeList;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.find;

@Service
public class NavCommonCodeClient {

    private final RestTemplate restTemplate;
    private final NavCommonCodeProps props;

    private final LoadingCache<String, List<CommonCodeResponse>> cache;

    public NavCommonCodeClient(RestTemplate restTemplate, NavCommonCodeProps props) {
        this.restTemplate = restTemplate;
        this.props = props;
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

    public String getDescription(String codeName, String code) {
        return find(cache.get(codeName), c -> c.getCode().equals(code)).map(CommonCodeResponse::getDescription).orElse(null);
    }

    private List<CommonCodeResponse> getCodeList(String codeName) {
        var resp = restTemplate.getForEntity(props.getGetWithTextUrl(), CommonCodeList.class, codeName, props.getLang());
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
