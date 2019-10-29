package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.hibernate.annotations.Type;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Data
@Builder
@ToString(exclude = {"policies"})
@EqualsAndHashCode(callSuper = false, exclude = {"policies"})
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "PROCESS")
public class Process extends Auditable<String> {

    @Id
    @Type(type = "pg-uuid")
    @Column(name = "PROCESS_ID")
    private UUID id;

    @NotNull
    @Column(name = "NAME", nullable = false)
    private String name;

    @NotNull
    @Column(name = "PURPOSE_CODE", nullable = false)
    private String purposeCode;

    @Builder.Default
    @OneToMany(mappedBy = "process")
    private Set<Policy> policies = new HashSet<>();

    // Added outside builder to enforce backreference
    public Process addPolicy(Policy policy) {
        if (policy != null) {
            policies.add(policy);
            policy.setProcess(this);
        }
        return this;
    }

    public ProcessResponse convertToResponse() {
        return ProcessResponse.builder()
                .id(id.toString())
                .name(name)
                .purposeCode(purposeCode)
                .build();
    }

    public ProcessResponse convertToResponseWithInformationTypes() {
        return ProcessResponse.builder()
                .id(id.toString())
                .name(name)
                .purposeCode(purposeCode)
                .informationTypes(convert(policies, Policy::convertToPurposeResponse))
                .build();
    }

    public static class ProcessBuilder {

        public ProcessBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }
}
