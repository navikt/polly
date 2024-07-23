package no.nav.data.common.storage.domain;

import com.fasterxml.jackson.databind.JsonNode;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.common.security.azure.support.MailLog;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.alert.domain.AlertEvent;
import org.hibernate.annotations.Type;
import org.springframework.util.Assert;

import java.util.UUID;

@Data
@Builder
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "GENERIC_STORAGE")
public class GenericStorage extends Auditable {
    
    // TODO: Klassen bør types

    @Id
    @Column(name = "ID")
    private UUID id;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "TYPE", nullable = false)
    private StorageType type;

    @Type(value = JsonBinaryType.class)
    @Column(name = "DATA", nullable = false)
    private JsonNode data;

    public void setDataObject(GenericStorageData data) {
        Assert.isTrue(type == null || type == data.type(), "invalid type");
        if (data instanceof GenericStorageIdData) {
            Assert.notNull(id, "GenericStorage has not set it's ID yet");
            ((GenericStorageIdData) data).setId(id);
        }
        this.data = JsonUtils.toJsonNode(data);
        this.type = data.type();
    }

    public <T extends GenericStorageData> T getDataObject(Class<T> clazz) {
        Assert.isTrue(type == StorageType.fromClass(clazz), "invalid type");
        T object = JsonUtils.toObject(data, clazz);
        object.setChangeStamp(new ChangeStamp(getCreatedBy(), getCreatedDate(), getLastModifiedBy(), getLastModifiedDate()));
        return object;
    }

    public GenericStorage(GenericStorageData data) {
        id = UUID.randomUUID();
        setDataObject(data);
    }

    public static class GenericStorageBuilder {

        public GenericStorageBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }

    public AlertEvent toAlertEvent() {
        return getDataObject(AlertEvent.class);
    }

    public MailLog toMailLog() {
        return getDataObject(MailLog.class);
    }
}
