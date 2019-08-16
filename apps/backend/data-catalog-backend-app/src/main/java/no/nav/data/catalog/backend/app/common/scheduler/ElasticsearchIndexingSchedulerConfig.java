package no.nav.data.catalog.backend.app.common.scheduler;

import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchDatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.IntervalTask;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableScheduling()
public class ElasticsearchIndexingSchedulerConfig implements SchedulingConfigurer {

    @Value("${esindexingjob.interval.seconds:1}")
    private Integer syncIntervalSeconds;

    @Autowired
    private ElasticsearchDatasetService service;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        long syncIntervalInMillis = TimeUnit.SECONDS.toMillis(syncIntervalSeconds);
        taskRegistrar.addFixedRateTask(syncTask(syncIntervalInMillis, 1000L));
    }

    IntervalTask syncTask(long interval, long initialDelay) {
        return new IntervalTask(service::synchToElasticsearch, interval, initialDelay);
    }
}
