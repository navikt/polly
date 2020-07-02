package no.nav.data.polly.alert;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.storage.StorageService;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.Optional;

@Slf4j
@Configuration
public class AlertConfig {

    @Bean
    public ApplicationRunner initEvents(
            StorageService storage,
            ProcessRepository processRepository,
            AlertService service
    ) {
        return (args) -> {
            storage.usingAppState(appState -> {
                if (!appState.isAlertEventsInitialized()) {
                    PageRequest pageable = PageRequest.of(0, 10, Sort.by("id"));
                    Page<Process> page = null;
                    do {
                        page = processRepository.findAll(
                                Optional.ofNullable(page)
                                        .map(Page::nextPageable)
                                        .orElse(pageable)
                        );
                        page.get().forEach(p -> service.calculateEventsForProcess(p.getId()));
                    } while (page.hasNext());

                    appState.setAlertEventsInitialized(true);
                    log.info("Ran event alerts for {}", page.getTotalElements());
                } else {
                    log.info("Skipping init alert events");
                }
            });
        };
    }

}
