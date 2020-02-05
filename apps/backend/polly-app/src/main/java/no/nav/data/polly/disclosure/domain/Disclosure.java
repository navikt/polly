package no.nav.data.polly.disclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.codeusage.UsedInInstance;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.auditing.domain.Auditable;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import org.hibernate.annotations.Type;

import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@Data
@Builder
@EqualsAndHashCode(callSuper = false)
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
        data.setLegalBases(convert(request.getLegalBases(), LegalBasisRequest::convertToLegalBasis));
        data.setDocumentId(request.getDocumentId() != null ? UUID.fromString(request.getDocumentId()): null);
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
                .build();
    }

    public UsedInInstance getInstanceIdentification() {
        return new UsedInInstance(id.toString(), data.getDescription());
    }

    public static class DisclosureBuilder {

        public DisclosureBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }
}
