package no.nav.data.common.utils;

import jakarta.annotation.PreDestroy;
import jakarta.validation.constraints.NotNull;
import org.slf4j.MDC;
import org.springframework.scheduling.concurrent.CustomizableThreadFactory;

import java.util.Map;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

public class MdcExecutor extends ThreadPoolExecutor {

    public static MdcExecutor newThreadPool(int maximumPoolSize, String name) {
        return new MdcExecutor(maximumPoolSize, name);
    }

    private MdcExecutor(int maximumPoolSize, String name) {
        super(1, maximumPoolSize, 60L, TimeUnit.SECONDS, new SynchronousQueue<>(), new CustomizableThreadFactory(name + "-"));
    }

    @Override
    public void execute(Runnable command) {
        var parentContext = MDC.getCopyOfContextMap();
        super.execute(wrap(command, parentContext));
    }

    /**
     * Replacement for Spring's removed ListenableFutureCallback.
     *
     * Returns callbacks that restore MDC before delegating to the provided handlers.
     */
    public static <T> WrappedCallbacks<T> wrap(Consumer<T> onSuccessCallback, Consumer<Throwable> onErrorCallback) {
        var parentContext = MDC.getCopyOfContextMap();
        return new WrappedCallbacks<>(
                result -> wrap(() -> onSuccessCallback.accept(result), parentContext).run(),
                ex -> wrap(() -> onErrorCallback.accept(ex), parentContext).run()
        );
    }

    public record WrappedCallbacks<T>(Consumer<T> onSuccess, Consumer<Throwable> onFailure) {
    }

    private static Runnable wrap(Runnable runnable, Map<String, String> parentContext) {
        return () -> {
            var previous = MDC.getCopyOfContextMap();
            if (parentContext == null) {
                MDC.clear();
            } else {
                MDC.setContextMap(parentContext);
            }
            try {
                runnable.run();
            } finally {
                if (previous == null) {
                    MDC.clear();
                } else {
                    MDC.setContextMap(previous);
                }
            }
        };
    }

    @Override
    @PreDestroy
    public void shutdown() {
        super.shutdown();
    }
}
