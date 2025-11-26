package no.nav.data.integration.nom;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.graphql.GraphQLRequest;
import no.nav.data.common.security.SecurityProperties;
import no.nav.data.common.security.TokenProvider;
import no.nav.data.common.utils.MetricUtils;
import no.nav.data.integration.nom.domain.OrgEnhet;
import no.nav.data.integration.nom.domain.OrgEnhetsType;
import no.nav.data.integration.nom.domain.Organisering;
import no.nav.data.integration.nom.dto.OrgEnhetGraphqlResponse;
import no.nav.data.integration.nom.dto.SearchOrgEnhetGraphqlResponse;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StreamUtils.safeStream;
import static no.nav.data.common.web.TraceHeaderRequestInterceptor.correlationInterceptor;

@Slf4j
@Service
@RequiredArgsConstructor
public class NomGraphClient {

    private RestTemplate restTemplate;
    private final RestTemplateBuilder restTemplateBuilder;
    private final SecurityProperties securityProperties;
    private final TokenProvider tokenProvider;
    private final NomGraphQlProperties nomGraphQlProperties;

    private static final String getUnderOrganiseringerQuery = readCpFile("nom/graphql/queries/get_all_under_organiseringer.graphql");
    private static final String getByIdQuery = readCpFile("nom/graphql/queries/get_by_id.graphql");
    private static final String searchOrgenhetByTermQuary = readCpFile("nom/graphql/queries/search_orgenhet_by_term.graphql");
    private static final String scopeTemplate = "api://%s-gcp.nom.nom-api/.default";

    private final LoadingCache<String, Map<String, OrgEnhet>> allAvdelingCache = MetricUtils
            .register("nomAvdelingCache", Caffeine.newBuilder().recordStats()
                    .expireAfterWrite(Duration.ofMinutes(10))
                    .maximumSize(1).build(k -> getAvdelingCache()));


    @SneakyThrows
    private static String readCpFile(String path) {
        return StreamUtils.copyToString(new ClassPathResource(path).getInputStream(), StandardCharsets.UTF_8);
    }

    private Map<String, OrgEnhet> getAvdelingCache() {
        if (securityProperties.isDev()) {
            var devAvdelinger = List.of(
                    createDevOrganisering("avdeling1", "Avdeling for brukeropplevelser"),
                    createDevOrganisering("avdeling_2", "Internrevisjon"),
                    createDevOrganisering("avdeling_3", "Kunnskapsavdelingen"),
                    createDevOrganisering("avdeling_4", "Velferdsavdelingen"),
                    createDevOrganisering("avdeling_5", "Kommunikasjonsavdelingen"),
                    createDevOrganisering("avdeling_6", "Avdeling for mennesker og organisasjon"),
                    createDevOrganisering("avdeling_7", "Ytelsesavdelingen"),
                    createDevOrganisering("avdeling_8", "Juridisk avdeling"),
                    createDevOrganisering("avdeling_9", "Arbeids- og velferdsdirektør"),
                    createDevOrganisering("avdeling_10", "Klageinstans"),
                    createDevOrganisering("avdeling_11", "Arbeidsavdelingen"),
                    createDevOrganisering("avdeling_12", "Økonomi- og styringsavdelingen"),
                    createDevOrganisering("avdeling_13", "Sekretariatet"),
                    createDevOrganisering("avdeling_14", "Teknologiavdelingen")
            );
            return safeStream(devAvdelinger)
                    .collect(Collectors.toMap(OrgEnhet::getId, Function.identity()));
        } else {
            var request = new GraphQLRequest(getUnderOrganiseringerQuery, Map.of("id", "bu431e"));
            var res = template().postForEntity(nomGraphQlProperties.getUrl(), request, OrgEnhetGraphqlResponse.class);

            assert res.getBody() != null;
            assert res.getBody().getData() != null;

            var response = res.getBody().getData();

            if (response.getOrgEnhet() == null) {
                return new HashMap<>();
            }

            var alleAvdelinger = response.getOrgEnhet().getOrganiseringer().stream().map(Organisering::getOrgEnhet).toList();

            return safeStream(alleAvdelinger)
                    .collect(Collectors.toMap(OrgEnhet::getId, Function.identity()));
        }
    }

    private Map<String, OrgEnhet> getAvdelingerFromCache() {
        return allAvdelingCache.get("singleton");
    }

    public List<OrgEnhet> getAllAvdelinger() {
        return new ArrayList<>(getAvdelingerFromCache().values());
    }

    public Optional<OrgEnhet> getAvdelingById(String id) {
        return Optional.ofNullable(getAvdelingCache().get(id));
    }

    public List<OrgEnhet> getAllSeksjonForAvdeling(String avdelingId) {
        var avdeling = getAvdelingById(avdelingId);
        if (avdeling.isEmpty()) {
            throw new ValidationException("Invalid avdeling id: " +  avdelingId);
        } else {
            if (securityProperties.isDev()) {
                return List.of(
                        createDevOrganisering("seksjon_1", "seksjon 1"),
                        createDevOrganisering("seksjon_2", "seksjon 2"),
                        createDevOrganisering("seksjon_3", "seksjon 3"),
                        createDevOrganisering("seksjon_4", "seksjon 4"),
                        createDevOrganisering("seksjon_5", "seksjon 5"),
                        createDevOrganisering("seksjon_6", "seksjon 6"),
                        createDevOrganisering("seksjon_7", "seksjon 7"),
                        createDevOrganisering("seksjon_8", "seksjon 8"),
                        createDevOrganisering("seksjon_9", "seksjon 9"),
                        createDevOrganisering("seksjon_10", "seksjon 10"),
                        createDevOrganisering("seksjon_11", "seksjon 11")
                );
            } else {
                var request = new GraphQLRequest(getUnderOrganiseringerQuery, Map.of("id", avdelingId));
                var res = template().postForEntity(nomGraphQlProperties.getUrl(), request, OrgEnhetGraphqlResponse.class);

                assert res.getBody() != null;
                assert res.getBody().getData() != null;

                var response = res.getBody().getData();

                if (response.getOrgEnhet() == null) {
                    return List.of();
                }

               return response.getOrgEnhet().getOrganiseringer().stream().map(Organisering::getOrgEnhet).toList();

            }
        }
    }



    public List<OrgEnhet> getAllFylker() {
            if (securityProperties.isDev()) {
                return List.of(
                        createDevOrganisering("fylke_1", "fylke 1"),
                        createDevOrganisering("fylke_2", "fylke 2"),
                        createDevOrganisering("fylke_3", "fylke 3"),
                        createDevOrganisering("fylke_4", "fylke 4"),
                        createDevOrganisering("fylke_5", "fylke 5"),
                        createDevOrganisering("fylke_6", "fylke 6"),
                        createDevOrganisering("fylke_7", "fylke 7"),
                        createDevOrganisering("fylke_8", "fylke 8"),
                        createDevOrganisering("fylke_9", "fylke 9"),
                        createDevOrganisering("fylke_10", "fylke 10"),
                        createDevOrganisering("fylke_11", "fylke 11")
                );
            } else {
                var request = new GraphQLRequest(getUnderOrganiseringerQuery, Map.of("id", "ry630r"));
                var res = template().postForEntity(nomGraphQlProperties.getUrl(), request, OrgEnhetGraphqlResponse.class);

                assert res.getBody() != null;
                assert res.getBody().getData() != null;

                var response = res.getBody().getData();

                if (response.getOrgEnhet() == null) {
                    return List.of();
                }

                return response.getOrgEnhet().getOrganiseringer().stream().map(Organisering::getOrgEnhet).toList();

            }
        }


    public List<OrgEnhet> searchNavkontorByTerm(String searchTerm) {
        if (searchTerm.length() > 2) {
            if (securityProperties.isDev()) {
                return List.of(
                        createDevOrganisering("kontor_1", "kontor 1"),
                        createDevOrganisering("kontor_2", "kontor 2"),
                        createDevOrganisering("kontor_3", "kontor 3"),
                        createDevOrganisering("kontor_4", "kontor 4"),
                        createDevOrganisering("kontor_5", "kontor 5"),
                        createDevOrganisering("kontor_6", "kontor 6"),
                        createDevOrganisering("kontor_7", "kontor 7"),
                        createDevOrganisering("kontor_8", "kontor 8"),
                        createDevOrganisering("kontor_9", "kontor 9"),
                        createDevOrganisering("kontor_10", "kontor 10"),
                        createDevOrganisering("kontor_11", "kontor 11")
                );
            } else {
                var request = new GraphQLRequest(searchOrgenhetByTermQuary, Map.of("searchTerm", searchTerm));
                var res = template().postForEntity(nomGraphQlProperties.getUrl(), request, SearchOrgEnhetGraphqlResponse.class);

                assert res.getBody() != null;
                assert res.getBody().getData() != null;

                var response = res.getBody().getData();

                if (response.getSearchOrgEnhet() == null) {
                    return List.of();
                }

                return response.getSearchOrgEnhet().stream().filter(orgEnhet -> orgEnhet.getOrgEnhetsType() == OrgEnhetsType.NAV_KONTOR).toList();

            }
        } else {
           return List.of();
        }
    }

    public OrgEnhet getById(String id) {
        var request = new GraphQLRequest(getByIdQuery, Map.of("id", id));
        var res = template().postForEntity(nomGraphQlProperties.getUrl(), request, OrgEnhetGraphqlResponse.class);
        assert res.getBody() != null;
        return res.getBody().getData().getOrgEnhet();
    }

    private RestOperations template() {
        if (restTemplate == null) {
            restTemplate = restTemplateBuilder
                    .additionalInterceptors(correlationInterceptor(), tokenInterceptor())
                    .messageConverters(new MappingJackson2HttpMessageConverter())
                    .build();
        }
        return restTemplate;
    }


    @SneakyThrows
    private ClientHttpRequestInterceptor tokenInterceptor() {
        if (securityProperties.isProd()) {
            return (request, body, execution) -> {
                String token = tokenProvider.getConsumerToken(getScope());
                log.debug("tokenInterceptor adding token: %s... for scope '%s'".formatted((token != null && token.length() > 12 ? token.substring(0, 11) : token), getScope()));
                request.getHeaders().add(HttpHeaders.AUTHORIZATION, token);
                return execution.execute(request, body);
            };
        }  else {
            return (request, body, execution) -> {
                return execution.execute(request, body);
            };
        }
    }

    private String getScope() {
        return scopeTemplate.formatted(securityProperties.isDev() ? "dev" : "prod");
    }

    private OrgEnhet createDevOrganisering(String id, String navn) {
        return OrgEnhet.builder().id(id).navn(navn).build();
    }
}
