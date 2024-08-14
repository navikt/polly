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
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.UsedInInstance;
import no.nav.data.polly.document.dto.DocumentInfoTypeUseResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import org.hibernate.annotations.Type;

import java.util.UUID;

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

    // TODO: Snu avhengigheten innover
    public static DocumentInfoTypeUseResponse convertToInfoTypeUseResponse(DocumentData.InformationTypeUse informationTypeUse) {
        return DocumentInfoTypeUseResponse.builder()
                .informationTypeId(informationTypeUse.getInformationTypeId())
                .subjectCategories(CodelistStaticService.getCodelistResponseList(ListName.SUBJECT_CATEGORY, informationTypeUse.getSubjectCategories()))
                .build();
    }

    // TODO: Snu avhengigheten innover
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
