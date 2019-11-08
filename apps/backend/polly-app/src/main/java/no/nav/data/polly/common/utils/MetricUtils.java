package no.nav.data.polly.common.utils;

import io.prometheus.client.Counter;
import io.prometheus.client.SimpleCollector;
import io.prometheus.client.Summary;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyTechnicalException;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static java.util.Objects.requireNonNull;

/**
 * Helper to create metrics
 * - avoid registring metrics multiple times during test
 * - instantiate labels up front to initialize them in prometheus/grafana
 */
@Slf4j
public final class MetricUtils {

    private static Map<String, SimpleCollector> collectors = new ConcurrentHashMap<>();

    private MetricUtils() {
    }

    public static CounterBuilder counter() {
        return new CounterBuilder();
    }

    public static SummaryBuilder summary() {
        return new SummaryBuilder();
    }

    @SuppressWarnings("unchecked")
    private static <T extends SimpleCollector> T register(T collector, List<String[]> labels) {
        try {
            Field nameField = ReflectionUtils.findField(SimpleCollector.class, "fullname");
            requireNonNull(nameField).setAccessible(true);
            String name = ((String) nameField.get(collector));
            SimpleCollector registeredCollector = collectors.computeIfAbsent(name, mapName -> init(collector, labels));
            if (registeredCollector.getClass().isAssignableFrom(collector.getClass())) {
                return (T) registeredCollector;
            } else {
                throw new PollyTechnicalException("Collector allready assigned to different type " + collector);
            }
        } catch (Exception e) {
            throw new PollyTechnicalException("failed to init collector", e);
        }
    }

    private static <T extends SimpleCollector> T init(T collector, List<String[]> labels) {
        // Initialize labels
        for (String[] label : labels) {
            collector.labels(label);
        }
        return collector.register();
    }

    public static class CounterBuilder extends Counter.Builder {

        private List<String[]> labels = new ArrayList<>();

        @Override
        public Counter register() {
            return MetricUtils.register(super.create(), labels);
        }


        public CounterBuilder labels(String... labels) {
            this.labels.add(labels);
            return this;
        }
    }

    public static class SummaryBuilder extends Summary.Builder {

        private List<String[]> labels = new ArrayList<>();

        @Override
        public Summary register() {
            return MetricUtils.register(super.create(), labels);
        }

        public SummaryBuilder labels(String... labels) {
            this.labels.add(labels);
            return this;
        }
    }
}
