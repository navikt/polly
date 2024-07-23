package no.nav.data.polly.process;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Component
public class DomainCache {

    private final LoadingCache<UUID, Optional<Process>> processCache;
    private final LoadingCache<UUID, Optional<InformationType>> infoTypeCache;
    private final LoadingCache<UUID, Optional<Disclosure>> disclosureCache;

    public DomainCache(ProcessRepository processRepository, InformationTypeRepository informationTypeRepository, DisclosureRepository disclosureRepository) {
        this.infoTypeCache = Caffeine.newBuilder().recordStats()
                .expireAfterWrite(Duration.ofMinutes(1))
                .maximumSize(1000).build(informationTypeRepository::findById);
        this.processCache = Caffeine.newBuilder().recordStats()
                .expireAfterWrite(Duration.ofMinutes(1))
                .maximumSize(1000).build(processRepository::findById);
        this.disclosureCache = Caffeine.newBuilder().recordStats()
                .expireAfterWrite(Duration.ofMinutes(1))
                .maximumSize(1000).build(disclosureRepository::findById);
    }

    public Optional<Process> getProcess(UUID uuid) {
        return processCache.get(uuid);
    }

    public Optional<InformationType> getInfoType(UUID uuid) {
        return infoTypeCache.get(uuid);
    }

    public Optional<Disclosure> getDisclosure(UUID uuid) {
        return disclosureCache.get(uuid);
    }
}
