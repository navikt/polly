package no.nav.data.polly.document.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.UsedInInstance;
import no.nav.data.polly.common.auditing.domain.Auditable;
import no.nav.data.polly.document.dto.DocumentInfoTypeResponse;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseResponse;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
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
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DOCUMENT")
public class Document extends Auditable {

    @Id
    @Type(type = "pg-uuid")
    @Column(name = "DOCUMENT_ID")
    private UUID id;

    @Valid
    @NotNull
    @Builder.Default
    @Type(type = "jsonb")
    @Column(name = "DATA", nullable = false)
    private DocumentData data = new DocumentData();

    public Document convertFromRequest(DocumentRequest request) {
        if (!request.isUpdate()) {
            setId(UUID.randomUUID());
        }
        data.setDescription(request.getDescription());
        data.setName(request.getName());
        data.setInformationTypes(convert(request.getInformationTypes(), DocumentData.InformationTypeUse::convertFromRequest));
        return this;
    }

    public DocumentResponse convertToResponse() {
        return DocumentResponse.builder()
                .id(id)
                .name(data.getName())
                .description(data.getDescription())
                .informationTypes(convert(data.getInformationTypes(), Document::convertToInfoTypeUseResponse))
                .build();
    }

    public static DocumentInfoTypeUseResponse convertToInfoTypeUseResponse(DocumentData.InformationTypeUse informationTypeUse) {
        return DocumentInfoTypeUseResponse.builder()
                .informationTypeId(informationTypeUse.getInformationTypeId())
                .subjectCategories(CodelistService.getCodelistResponseList(ListName.SUBJECT_CATEGORY, informationTypeUse.getSubjectCategories()))
                .build();
    }

    public static DocumentInfoTypeResponse convertToInformationTypeResponse(InformationType informationType) {
        return new DocumentInfoTypeResponse(informationType.getId(), informationType.getData().getName(), informationType.getData().sensitivityCode());
    }

    public UsedInInstance getInstanceIdentification() {
        return new UsedInInstance(id.toString(), data.getName());
    }

    public static class DocumentBuilder {

        public Document.DocumentBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }
}
