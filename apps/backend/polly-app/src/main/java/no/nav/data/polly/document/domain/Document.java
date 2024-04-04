package no.nav.data.polly.document.domain;

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
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.UsedInInstance;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseResponse;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import org.hibernate.annotations.Type;

import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DOCUMENT")
public class Document extends Auditable {

    @Id
    @Column(name = "DOCUMENT_ID")
    private UUID id;

    @Valid
    @NotNull
    @Builder.Default
    @Type(value = JsonBinaryType.class)
    @Column(name = "DATA", nullable = false)
    private DocumentData data = new DocumentData();

    public Document convertFromRequest(DocumentRequest request) {
        if (!request.isUpdate()) {
            setId(UUID.randomUUID());
        }
        data.setDescription(request.getDescription());
        data.setName(request.getName());
        data.setDataAccessClass(request.getDataAccessClass());
        data.setInformationTypes(convert(request.getInformationTypes(), DocumentData.InformationTypeUse::convertFromRequest));
        return this;
    }

    public DocumentResponse convertToResponse() {
        return DocumentResponse.builder()
                .id(id)
                .name(data.getName())
                .description(data.getDescription())
                .informationTypes(convert(data.getInformationTypes(), Document::convertToInfoTypeUseResponse))
                .dataAccessClass(CodelistService.getCodelistResponse(ListName.DATA_ACCESS_CLASS,data.getDataAccessClass()))
                .build();
    }

    public static DocumentInfoTypeUseResponse convertToInfoTypeUseResponse(DocumentData.InformationTypeUse informationTypeUse) {
        return DocumentInfoTypeUseResponse.builder()
                .informationTypeId(informationTypeUse.getInformationTypeId())
                .subjectCategories(CodelistService.getCodelistResponseList(ListName.SUBJECT_CATEGORY, informationTypeUse.getSubjectCategories()))
                .build();
    }

    public static InformationTypeShortResponse convertToInformationTypeResponse(InformationType informationType) {
        return new InformationTypeShortResponse(informationType.getId(), informationType.getData().getName(), informationType.getData().sensitivityCode());
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
