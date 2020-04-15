package no.nav.data.polly.common.storage.domain;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.common.auditing.domain.Auditable;
import no.nav.data.polly.common.utils.JsonUtils;
import org.hibernate.annotations.Type;
import org.springframework.util.Assert;

import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Data
@Builder
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "GENERIC_STORAGE")
public class GenericStorage extends Auditable {

    @Id
    @Type(type = "pg-uuid")
    @Column(name = "ID")
    private UUID id;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "TYPE", nullable = false)
    private StorageType type;

    @Type(type = "jsonb")
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
        return JsonUtils.toObject(data, clazz);
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
}
