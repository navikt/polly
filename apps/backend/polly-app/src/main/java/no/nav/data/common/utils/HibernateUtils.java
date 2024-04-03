package no.nav.data.common.utils;

import lombok.SneakyThrows;
import org.hibernate.proxy.HibernateProxy;
import org.hibernate.proxy.LazyInitializer;
import org.springframework.data.util.ReflectionUtils;

import java.util.UUID;

public final class HibernateUtils {

    private HibernateUtils() {
    }

    /**
     * Get id without loading the entity
     */
    @SneakyThrows
    public static UUID getId(Object entity) {
        if (entity instanceof HibernateProxy) {
            LazyInitializer lazyInitializer = ((HibernateProxy) entity).getHibernateLazyInitializer();
            if (lazyInitializer.isUninitialized()) {
                return (UUID) lazyInitializer.getIdentifier();
            }
        }
        return (UUID) ReflectionUtils.findRequiredMethod(entity.getClass(), "getId").invoke(entity);
    }

}
