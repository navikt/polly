package no.nav.data.catalog.backend.app.common.auditing;

import static javax.persistence.TemporalType.TIMESTAMP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import java.util.Date;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable<U> {
	@JsonIgnore
	@CreatedBy
	@Column(name = "CREATED_BY")
    protected U createdBy;

	@JsonIgnore
	@CreatedDate
	@Temporal(TIMESTAMP)
	@Column(name = "CREATED_DATE")
	protected Date createdDate;

	@JsonIgnore
	@LastModifiedBy
	@Column(name = "LAST_MODIFIED_BY")
    protected U lastModifiedBy;

	@JsonIgnore
	@LastModifiedDate
    @Temporal(TIMESTAMP)
	@Column(name = "LAST_MODIFIED_DATE")
    protected Date lastModifiedDate;
}
