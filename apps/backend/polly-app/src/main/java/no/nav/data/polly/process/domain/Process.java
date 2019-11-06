package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.elasticsearch.dto.ProcessElasticsearch;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.dto.ProcessPolicyResponse;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.hibernate.annotations.Type;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.Valid;
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

    @Valid
    @Builder.Default
    @NotNull
    @Type(type = "jsonb")
    @Column(name = "DATA", nullable = false)
    private ProcessData data = new ProcessData();

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

    public boolean isActive() {
        return DateUtil.isNow(data.getStart(), data.getEnd());
    }

    public ProcessResponse convertToResponse() {
        return ProcessResponse.builder()
                .id(id.toString())
                .name(name)
                .purposeCode(purposeCode)
                .department(data.getDepartment())
                .subDepartment(data.getSubDepartment())
                .start(data.getStart())
                .end(data.getEnd())
                .legalBases(convert(data.getLegalBases(), LegalBasis::convertToResponse))
                .build();
    }

    public ProcessPolicyResponse convertToResponseWithPolicies() {
        return ProcessPolicyResponse.builder()
                .id(id.toString())
                .name(name)
                .purposeCode(purposeCode)
                .department(data.getDepartment())
                .subDepartment(data.getSubDepartment())
                .start(data.getStart())
                .end(data.getEnd())
                .legalBases(convert(data.getLegalBases(), LegalBasis::convertToResponse))
                .policies(convert(policies, Policy::convertToResponse))
                .build();
    }

    public ProcessElasticsearch convertToElasticsearch(List<Policy> policies) {
        Codelist purpose = CodelistService.getCodelist(ListName.PURPOSE, purposeCode);
        return ProcessElasticsearch.builder()
                .id(id.toString())
                .name(name)
                .purpose(purpose.getCode())
                .purposeDescription(purpose.getDescription())
                .department(data.getDepartment())
                .subDepartment(data.getSubDepartment())
                .start(DateUtil.formatDate(data.getStart()))
                .end(DateUtil.formatDate(data.getEnd()))
                .active(isActive())
                .legalbases(convert(data.getLegalBases(), LegalBasis::convertToElasticsearch))
                .policies(convert(policies, Policy::convertToElasticsearch))
                .build();
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class ProcessBuilder {

        public ProcessBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

    }
}
