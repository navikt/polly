package no.nav.data.polly.process;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
public class DomainCache {

    private final LoadingCache<UUID, Optional<InformationType>> infoTypeCache;
    private final LoadingCache<UUID, Optional<Process>> processCache;

    public DomainCache(ProcessRepository processRepository, InformationTypeRepository informationTypeRepository) {
        this.infoTypeCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(1))
                .maximumSize(1000).build(informationTypeRepository::findById);
        this.processCache = Caffeine.newBuilder().recordStats()
                .expireAfterAccess(Duration.ofMinutes(1))
                .maximumSize(1000).build(processRepository::findById);
    }

    public Optional<Process> getProcess(UUID uuid) {
        return processCache.get(uuid);
    }

    public Optional<InformationType> getInfoType(UUID uuid) {
        return infoTypeCache.get(uuid);
    }
}
