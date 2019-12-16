package no.nav.data.polly.common.auditing;

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
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.common.utils.HibernateUtils;
import no.nav.data.polly.common.utils.JsonUtils;
import org.hibernate.proxy.HibernateProxy;

import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

@Slf4j
public class AuditVersionListener {

    private static AuditVersionRepository repository;

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

    private void audit(Object entity, Action action) {
        try {
            String tableName = entity.getClass().getAnnotation(Table.class).name();
            String id;
            if (entity instanceof Codelist) {
                id = ((Codelist) entity).getList() + "-" + ((Codelist) entity).getCode();
            } else {
                id = HibernateUtils.getId(entity).toString();
            }
            String data = wr.writeValueAsString(entity);
            AuditVersion auditVersion = new AuditVersion(action, tableName, id, data);
            repository.save(auditVersion);
        } catch (JsonProcessingException e) {
            log.error("failed to serialize object", e);
        }
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
