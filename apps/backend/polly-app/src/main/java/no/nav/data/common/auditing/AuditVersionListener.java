package no.nav.data.common.auditing;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.PropertyWriter;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.auditing.domain.Action;
import no.nav.data.common.auditing.domain.AuditVersion;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.utils.HibernateUtils;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.common.utils.MdcUtils;
import no.nav.data.polly.codelist.domain.Codelist;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.Optional;
import java.util.UUID;

@Slf4j
public class AuditVersionListener {

    // Merk: Denne klassen er IKKE håndtert av Spring (siden den instansieres av JPA), men den avhenger av en Spring-managed bønne.
    // Dette er løst med et hæck der Spring kaller en statisk metode i denne klassen for å tilby bønna.
    // Men dette hacket virker ikke alltid for integrasjonstesting, så det er et hæck til i IntegrationTestBase for å få det til å gå.
    
    private static volatile AuditVersionRepository repository;

    private static final ObjectWriter wr;

    static {
        FilterProvider filters = new SimpleFilterProvider().addFilter("relationFilter", new RelationFilter());
        var om = JsonUtils.createObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, Visibility.NONE);
        om.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
        wr = om.writer(filters);
    }

    public static void setRepo(AuditVersionRepository repository) {
        AuditVersionListener.repository = repository;
    }

    @PrePersist
    public void prePersist(Object entity) {
        audit(entity, Action.CREATE);
    }

    @PreUpdate
    public void preUpdate(Object entity) {
        audit(entity, Action.UPDATE);
    }

    @PreRemove
    public void preRemove(Object entity) {
        audit(entity, Action.DELETE);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    private void audit(Object entity, Action action) {
        try {
            Assert.isTrue(entity instanceof Auditable, "Invalid object");
            if (entity instanceof GenericStorage genStorage && !genStorage.getType().isAudit()) {
                return;
            }
            String tableName = AuditVersion.tableName(((Auditable) entity).getClass());
            String id = getIdForObject(entity);
            String data = wr.writeValueAsString(entity);
            String user = Optional.ofNullable(MdcUtils.getUser()).orElse("no-user-set");
            AuditVersion auditVersion = AuditVersion.builder()
                    .action(action).table(tableName).tableId(id).data(data).user(user)
                    .build();
            repository.save(auditVersion);
        } catch (JsonProcessingException e) {
            log.error("failed to serialize object", e);
        }
    }

    public static String getIdForObject(Object entity) {
        String id;
        if (entity instanceof Codelist clEntity) {
            id = clEntity.getList() + "-" + clEntity.getCode();
        } else {
            UUID uuid = HibernateUtils.getId(entity);
            Assert.notNull(uuid, "entity has not set id");
            id = uuid.toString();
        }
        return id;
    }

    private static class RelationFilter extends SimpleBeanPropertyFilter {

        @Override
        public void serializeAsField(Object pojo, JsonGenerator jgen, SerializerProvider provider, PropertyWriter writer) throws Exception {
            boolean root = jgen.getOutputContext().getParent().getParent() == null;
            boolean isEntity = pojo.getClass().isAnnotationPresent(Entity.class) || pojo instanceof HibernateProxy;
            if (root || !isEntity) {
                super.serializeAsField(pojo, jgen, provider, writer);
            } else {
                String fieldName = writer.getName();
                if (fieldName.equals("id")) {
                    UUID id = HibernateUtils.getId(pojo);
                    jgen.writeFieldName(fieldName);
                    jgen.writeString(id.toString());
                }
            }
        }
    }
}
