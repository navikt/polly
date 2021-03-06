package no.nav.data.common.auditing.domain;

import com.fasterxml.jackson.annotation.JsonFilter;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.auditing.AuditVersionListener;
import no.nav.data.common.rest.ChangeStampResponse;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;

@Getter
@Setter
@MappedSuperclass
@FieldNameConstants
@JsonFilter("relationFilter")
@EntityListeners({AuditingEntityListener.class, AuditVersionListener.class})
public abstract class Auditable {

    public abstract UUID getId();

    @CreatedBy
    @Column(name = "CREATED_BY")
    protected String createdBy;

    @CreatedDate
    @Column(name = "CREATED_DATE")
    protected LocalDateTime createdDate;

    @LastModifiedBy
    @Column(name = "LAST_MODIFIED_BY")
    protected String lastModifiedBy;

    @Version
    @LastModifiedDate
    @Column(name = "LAST_MODIFIED_DATE")
    protected LocalDateTime lastModifiedDate;

    public ChangeStampResponse convertChangeStampResponse() {
        return ChangeStampResponse.builder()
                .lastModifiedBy(getLastModifiedBy())
                .lastModifiedDate(getLastModifiedDate() == null ? LocalDateTime.now() : getLastModifiedDate())
                .build();
    }
}
