package no.nav.data.catalog.backend.app.common.nais;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Slf4j
@Service
public class LeaderElectionService {

    private String electorPath;
    private RestTemplate restTemplate;

    public LeaderElectionService(@Value("${nais.elector.path}") String electorPath, RestTemplate restTemplate) {
        this.electorPath = electorPath;
        this.restTemplate = restTemplate;
    }

    public boolean isLeader() {
        try {
            return getHostInfo().equals(getLeader());
        } catch (Exception e) {
            log.error("failed to get leader", e);
            return false;
        }
    }

    private HostInfo getLeader() {
        String leaderJson = restTemplate.getForObject("http://" + electorPath, String.class);
        return JsonUtils.toObject(leaderJson, HostInfo.class);
    }

    public static HostInfo getHostInfo() {
        try {
            return new HostInfo(InetAddress.getLocalHost().getHostName());
        } catch (UnknownHostException e) {
            log.error("failed to get hostname for leader election", e);
            return new HostInfo();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HostInfo {

        private String name;
    }

}
