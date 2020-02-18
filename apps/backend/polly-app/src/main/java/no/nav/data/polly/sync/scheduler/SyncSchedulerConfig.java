package no.nav.data.polly.sync.scheduler;

import no.nav.data.polly.sync.SyncProperties;
import no.nav.data.polly.sync.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.IntervalTask;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.util.concurrent.TimeUnit;

import static no.nav.data.polly.common.utils.MdcUtils.wrapAsync;

@Configuration
@EnableScheduling
public class SyncSchedulerConfig implements SchedulingConfigurer {

    @Autowired
    private SyncProperties properties;
    @Autowired
    private SyncService service;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        if (!properties.indexingDisabled()) {
            long syncIntervalInMillis = TimeUnit.SECONDS.toMillis(properties.getIntervalSeconds());
            taskRegistrar.addFixedRateTask(syncTask(syncIntervalInMillis, 1000L));
        }
    }

    IntervalTask syncTask(long interval, long initialDelay) {
        return new IntervalTask(wrapAsync(service::sync, "sync"), interval, initialDelay);
    }
}
