package no.nav.data.polly.informationtype.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.codelist.codeusage.UsedInInstance;
import no.nav.data.polly.common.auditing.domain.Auditable;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus;
import no.nav.data.polly.elasticsearch.dto.InformationTypeElasticsearch;
import no.nav.data.polly.elasticsearch.dto.ProcessElasticsearch;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import no.nav.data.polly.policy.domain.Policy;
import org.hibernate.annotations.Type;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.SYNCED;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus.TO_BE_UPDATED;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"policies"})
@EqualsAndHashCode(callSuper = false, exclude = {"policies"})
@Entity
@Table(name = "INFORMATION_TYPE")
public class InformationType extends Auditable<String> {

    @Id
    @Type(type = "pg-uuid")
    @Column(name = "INFORMATION_TYPE_ID", nullable = false, updatable = false)
    private UUID id;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ElasticsearchStatus elasticsearchStatus;

    @Builder.Default
    @Valid
    @NotNull
    @Type(type = "jsonb")
    @Column(name = "DATA")
    private InformationTypeData data = new InformationTypeData();

    @Column(name = "TERM_ID")
    private String termId;

    @Builder.Default
    @OneToMany(mappedBy = "informationType")
    private Set<Policy> policies = new HashSet<>();

    // Added outside builder to enforce backreference
    public InformationType addPolicy(Policy policy) {
        if (policy != null) {
            policies.add(policy);
            policy.setInformationType(this);
        }
        return this;
    }

    public InformationTypeResponse convertToResponse() {
        return new InformationTypeResponse(this);
    }

    public UsedInInstance getInstanceIdentification(){
        return UsedInInstance.builder().id(id.toString()).name(data.getName()).build();
    }

    public InformationType convertNewFromRequest(InformationTypeRequest request) {
        id = UUID.randomUUID();
        elasticsearchStatus = TO_BE_CREATED;
        convertFromRequest(request);
        return this;
    }

    public void convertUpdateFromRequest(InformationTypeRequest request) {
        elasticsearchStatus = elasticsearchStatus == SYNCED ? TO_BE_UPDATED : elasticsearchStatus;
        convertFromRequest(request);
    }

    private void convertFromRequest(InformationTypeRequest request) {
        setTermId(request.getTerm());
        data.setName(request.getName());
        data.setDescription(request.getDescription());
        data.setSensitivity(request.getSensitivity());
        data.setNavMaster(request.getNavMaster());
        data.setCategories(copyOf(request.getCategories()));
        data.setSources(copyOf(request.getSources()));
        data.setKeywords(copyOf(request.getKeywords()));

        preUpdate();
    }

    public void preUpdate() {
        data.setSuggest(data.getName() + " " + String.join(" ", data.getKeywords()) + " " + data.getDescription());
    }

    public InformationTypeElasticsearch convertToElasticsearch(List<ProcessElasticsearch> processes) {
        return new InformationTypeElasticsearch(this, processes);
    }

    public static class InformationTypeBuilder {

        public InformationTypeBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }

}
