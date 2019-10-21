package no.nav.polly.common.scheduler;

import no.nav.polly.kafka.KafkaMetadataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.IntervalTask;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

import static no.nav.polly.common.utils.MdcUtils.wrapAsync;

@Configuration
@EnableScheduling
public class KafkaIndexingSchedulerConfig implements SchedulingConfigurer {

    @Value("${kafkaindexingjob.interval.seconds:-1}")
    private Integer syncIntervalSeconds;

    @Autowired
    private KafkaMetadataService service;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        if (syncIntervalSeconds < 0) {
            return;
        }
        taskRegistrar.addFixedRateTask(syncTask());
    }

    IntervalTask syncTask() {
        long syncIntervalInMillis = TimeUnit.SECONDS.toMillis(syncIntervalSeconds);
        return new IntervalTask(wrapAsync(service::syncDistributionsFromKafkaAdmin, "kafkasync"), syncIntervalInMillis, Duration.ofMinutes(2).toMillis());
    }
}
