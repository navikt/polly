package no.nav.data.polly.informationtype.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.UsedInInstance;
import no.nav.data.polly.common.auditing.domain.Auditable;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.policy.domain.Policy;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Type;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"policies"})
@EqualsAndHashCode(callSuper = false, exclude = {"policies"})
@Entity
@Table(name = "INFORMATION_TYPE")
public class InformationType extends Auditable {

    @Id
    @Type(type = "pg-uuid")
    @Column(name = "INFORMATION_TYPE_ID", nullable = false, updatable = false)
    private UUID id;

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

    public InformationTypeShortResponse convertToShortResponse() {
        return new InformationTypeShortResponse(getId(), getData().getName(), CodelistService.getCodelistResponse(ListName.SENSITIVITY, data.getSensitivity()));
    }

    public UsedInInstance getInstanceIdentification() {
        return UsedInInstance.builder().id(id.toString()).name(data.getName()).build();
    }

    public InformationType convertNewFromRequest(InformationTypeRequest request) {
        id = UUID.randomUUID();
        convertFromRequest(request);
        return this;
    }

    public void convertUpdateFromRequest(InformationTypeRequest request) {
        convertFromRequest(request);
    }

    private void convertFromRequest(InformationTypeRequest request) {
        setTermId(request.getTerm());
        data.setName(request.getName());
        data.setDescription(request.getDescription());
        data.setSensitivity(request.getSensitivity());
        data.setOrgMaster(request.getOrgMaster());
        data.setProductTeams(copyOf(request.getProductTeams()));
        data.setCategories(copyOf(request.getCategories()));
        data.setSources(copyOf(request.getSources()));
        data.setKeywords(copyOf(request.getKeywords()));

        preUpdate();
    }

    public void preUpdate() {
        data.setSuggest(data.getName() + " " + String.join(" ", data.getKeywords()) + " " + StringUtils.trimToEmpty(data.getDescription()));
    }

    public static class InformationTypeBuilder {

        public InformationTypeBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }

}
