package no.nav.data.polly.disclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.UsedInInstance;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.disclosure.dto.DisclosureSummaryResponse;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.process.domain.repo.ProcessVeryShort;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.copyOf;

@Slf4j
@Data
@Builder
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DISCLOSURE")
public class Disclosure extends Auditable {

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
        data.setAgreementReference(request.getAgreementReference());
        data.setThirdCountryReceiver(request.getThirdCountryReceiver());
        return this;
    }

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
                .abroad(data.getAbroad().convertToResponse())
                .agreementReference(data.getAgreementReference())
                .thirdCountryReceiver(data.getThirdCountryReceiver())
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
