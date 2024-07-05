package no.nav.data.polly.disclosure.domain;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.UsedInInstance;
import no.nav.data.polly.disclosure.dto.DisclosureAbroadResponse;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.disclosure.dto.DisclosureSummaryResponse;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.process.domain.repo.ProcessVeryShort;
import org.hibernate.annotations.Type;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.copyOf;

@Data
@Builder
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DISCLOSURE")
public class Disclosure extends Auditable {

    @Id
    @Column(name = "DISCLOSURE_ID")
    private UUID id;

    @Valid
    @NotNull
    @Builder.Default
    @Type(value = JsonBinaryType.class)
    @Column(name = "DATA", nullable = false)
    private DisclosureData data = new DisclosureData();

    // TODO: Snu avhengigheten innover
    public Disclosure convertFromRequest(DisclosureRequest request) {
        if (!request.isUpdate()) {
            setId(UUID.randomUUID());
        }
        data.setName(request.getName());
        data.setDescription(request.getDescription());
        data.setRecipient(request.getRecipient());
        data.setRecipientPurpose(request.getRecipientPurpose());
        data.setStart(DateUtil.parseStart(request.getStart()));
        data.setEnd(DateUtil.parseEnd(request.getEnd()));
        data.setLegalBases(convert(request.getLegalBases(), LegalBasisRequest::convertToDomain));
        data.setDocumentId(request.getDocumentId() != null ? UUID.fromString(request.getDocumentId()) : null);
        data.setInformationTypeIds(convert(request.getInformationTypeIds(), UUID::fromString));
        data.setProcessIds(convert(request.getProcessIds(), UUID::fromString));
        data.setAbroad(DisclosureAbroad.convertAbroad(request.getAbroad()));
        data.setAdministrationArchiveCaseNumber(request.getAdministrationArchiveCaseNumber());
        data.setThirdCountryReceiver(request.getThirdCountryReceiver());
        data.setAssessedConfidentiality(request.getAssessedConfidentiality());
        data.setConfidentialityDescription(request.getConfidentialityDescription());
        data.setDepartment(request.getDepartment());
        data.setProductTeams(copyOf(request.getProductTeams()));
        return this;
    }

    // TODO: Snu avhengigheten innover
    public DisclosureResponse convertToResponse() {
        return DisclosureResponse.builder()
                .id(id)
                .name(data.getName())
                .description(data.getDescription())
                .recipient(CodelistService.getCodelistResponse(ListName.THIRD_PARTY, data.getRecipient()))
                .recipientPurpose(data.getRecipientPurpose())
                .legalBases(convert(data.getLegalBases(), LegalBasis::convertToResponse))
                .start(data.getStart())
                .end(data.getEnd())
                .documentId(data.getDocumentId())
                .informationTypeIds(copyOf(data.getInformationTypeIds()))
                .processIds(copyOf(data.getProcessIds()))
                .abroad(DisclosureAbroadResponse.buildFrom(data.getAbroad() != null ? data.getAbroad() : new DisclosureAbroad()))
                .administrationArchiveCaseNumber(data.getAdministrationArchiveCaseNumber())
                .thirdCountryReceiver(data.getThirdCountryReceiver())
                .assessedConfidentiality(data.getAssessedConfidentiality())
                .confidentialityDescription(data.getConfidentialityDescription())
                .department(CodelistService.getCodelistResponse(ListName.DEPARTMENT, data.getDepartment()))
                .productTeams(copyOf(data.getProductTeams()))
                .changeStamp(convertChangeStampResponse())
                .build();
    }

    public UsedInInstance getInstanceIdentification() {
        return new UsedInInstance(id.toString(), data.getName());
    }

    public DisclosureSummaryResponse convertToSummary(List<ProcessVeryShort> processes) {
        return DisclosureSummaryResponse.builder()
                .id(id)
                .name(data.getName())
                .recipient(CodelistService.getCodelistResponse(ListName.THIRD_PARTY, data.getRecipient()))
                .processes(convert(processes, ProcessVeryShort::toResponse))
                .legalBases(data.getLegalBases().size())
                .build();
    }

    public static class DisclosureBuilder {

        public DisclosureBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }
}
