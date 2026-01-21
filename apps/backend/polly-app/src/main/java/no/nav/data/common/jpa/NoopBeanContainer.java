package no.nav.data.common.jpa;

import org.hibernate.Incubating;
import org.hibernate.resource.beans.container.spi.BeanContainer;
import org.hibernate.resource.beans.container.spi.ContainedBean;
import org.hibernate.resource.beans.spi.BeanInstanceProducer;

/**
 * Hibernate 7 BeanContainer that disables managed-bean resolution.
 *
 * We use this to prevent Hibernate from trying to resolve JPA entity listeners
 * (e.g. AuditVersionListener) via Spring/CDI, which can trigger
 * "Wrong type of bean" assertion failures.
 */
@Incubating
public final class NoopBeanContainer implements BeanContainer {

    @Override
    public <T> ContainedBean<T> getBean(Class<T> beanClass, LifecycleOptions lifecycleOptions, BeanInstanceProducer fallbackProducer) {
        // Treat as unmanaged; let Hibernate instantiate directly.
        return null;
    }

    @Override
    public <T> ContainedBean<T> getBean(String name, Class<T> beanClass, LifecycleOptions lifecycleOptions, BeanInstanceProducer fallbackProducer) {
        // Treat as unmanaged; let Hibernate instantiate directly.
        return null;
    }

    @Override
    public void stop() {
        // no-op
    }
}
