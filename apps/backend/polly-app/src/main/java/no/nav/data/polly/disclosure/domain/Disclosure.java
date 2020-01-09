package no.nav.data.polly.disclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.codeusage.UsedInInstance;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.auditing.domain.Auditable;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.disclosure.dto.DisclosureInformationTypeResponse;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import org.hibernate.annotations.Type;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@Data
@Builder
@ToString(exclude = {"informationTypes"})
@EqualsAndHashCode(callSuper = false, exclude = {"informationTypes"})
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DISCLOSURE")
public class Disclosure extends Auditable<String> {

    @Id
    @Type(type = "pg-uuid")
    @Column(name = "DISCLOSURE_ID")
    private UUID id;

    @Valid
    @NotNull
    @Builder.Default
    @Type(type = "jsonb")
    @Column(name = "DATA", nullable = false)
    private DisclosureData data = new DisclosureData();

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "DISCLOSURE_INFORMATION_TYPE", joinColumns = @JoinColumn(name = "DISCLOSURE_ID"), inverseJoinColumns = @JoinColumn(name = "INFORMATION_TYPE_ID"))
    private Set<InformationType> informationTypes = new HashSet<>();

    // Added outside builder to enforce backreference
    public void addInformationType(InformationType informationType) {
        if (informationType != null) {
            log.debug("Disclosure {} - adding informationType {}", id, informationType.getId());
            informationTypes.add(informationType);
            informationType.getDisclosures().add(this);
        }
    }

    public void removeInformationType(InformationType informationType) {
        if (informationType != null) {
            log.debug("Disclosure {} - removing informationType {}", id, informationType.getId());
            informationTypes.remove(informationType);
            informationType.getDisclosures().remove(this);
        }
    }

    public Disclosure convertFromRequest(DisclosureRequest request) {
        if (!request.isUpdate()) {
            setId(UUID.randomUUID());
        }
        data.setDescription(request.getDescription());
        data.setRecipient(request.getRecipient());
        data.setRecipientPurpose(request.getRecipientPurpose());
        data.setStart(DateUtil.parseStart(request.getStart()));
        data.setEnd(DateUtil.parseEnd(request.getEnd()));
        data.setLegalBases(convert(request.getLegalBases(), LegalBasisRequest::convertToLegalBasis));

        var removeInfoTypes = informationTypes.stream().filter(it -> !request.getInformationTypes().contains(it.getId().toString())).collect(Collectors.toList());
        removeInfoTypes.forEach(this::removeInformationType);

        request.getInformationTypesData().forEach(informationType -> {
            if (!informationTypes.contains(informationType)) {
                addInformationType(informationType);
            }
        });
        return this;
    }

    public DisclosureResponse convertToResponseWithInformationType() {
        var resp = convertToResponse();
        resp.setInformationTypes(convert(informationTypes, Disclosure::convertInformationTypeResponse));
        return resp;
    }

    public DisclosureResponse convertToResponse() {
        return DisclosureResponse.builder()
                .id(id)
                .description(data.getDescription())
                .recipient(CodelistService.getCodelistResponse(ListName.THIRD_PARTY, data.getRecipient()))
                .recipientPurpose(data.getRecipientPurpose())
                .legalBases(convert(data.getLegalBases(), LegalBasis::convertToResponse))
                .start(data.getStart())
                .end(data.getEnd())
                .build();
    }

    public UsedInInstance getInstanceIdentification() {
        return new UsedInInstance(id.toString(), data.getDescription());
    }

    private static DisclosureInformationTypeResponse convertInformationTypeResponse(InformationType informationType) {
        return new DisclosureInformationTypeResponse(informationType.getId(), informationType.getData().getName(), informationType.getData().sensitivityCode());
    }

    public static class DisclosureBuilder {

        public DisclosureBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }
}
