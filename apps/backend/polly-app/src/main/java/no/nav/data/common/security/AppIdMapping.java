package no.nav.data.common.security;

import org.apache.commons.lang3.StringUtils;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

public class AppIdMapping {

    private static final Map<String, String> appIdAppNameMap = new HashMap<>();

    public AppIdMapping(String mappings) {
        Stream.of(StringUtils.split(mappings, ','))
                .map(appId -> appId.split(":"))
                .forEach(appIdAppName -> appIdAppNameMap.put(appIdAppName[0], appIdAppName[1]));
    }

    public static String getAppNameForAppId(String appId) {
        return appId == null ? null : appIdAppNameMap.getOrDefault(appId, "not-found");
    }

    public Collection<String> getIds() {
        return appIdAppNameMap.keySet();
    }
}
