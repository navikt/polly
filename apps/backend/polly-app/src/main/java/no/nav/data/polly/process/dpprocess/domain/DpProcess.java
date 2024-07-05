package no.nav.data.polly.process.dpprocess.domain;

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
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.dpprocess.dto.DpProcessRequest;
import no.nav.data.polly.process.dpprocess.dto.DpProcessResponse;
import no.nav.data.polly.process.dpprocess.dto.DpProcessShortResponse;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;
import no.nav.data.polly.process.dto.sub.DataProcessingRequest;
import no.nav.data.polly.process.dto.sub.DataProcessingResponse;
import org.hibernate.annotations.Type;

import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.copyOf;
import static no.nav.data.polly.process.dpprocess.domain.sub.DpRetention.convertRetention;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DP_PROCESS")
public class DpProcess extends Auditable {

    @Id
    @Column(name = "DP_PROCESS_ID")
    private UUID id;

    @Valid
    @Builder.Default
    @NotNull
    @Type(value = JsonBinaryType.class)
    @Column(name = "DATA", nullable = false)
    private DpProcessData data = new DpProcessData();

    public boolean isActive() {
        return DateUtil.isNow(data.getStart(), data.getEnd());
    }

    // TODO: Snu avhengigheten innover
    public DpProcess convertFromRequest(DpProcessRequest request) {
        if (!request.isUpdate()) {
            id = UUID.randomUUID();
            data.setDpProcessNumber(request.getNewDpProcessNmber());
        }
        data.setName(request.getName());
        data.setAffiliation(request.getAffiliation() == null ? new Affiliation() : request.getAffiliation().convertToAffiliation());
        data.setExternalProcessResponsible(request.getExternalProcessResponsible());
        data.setStart(DateUtil.parseStart(request.getStart()));
        data.setEnd(DateUtil.parseEnd(request.getEnd()));
        data.setDataProcessingAgreements(copyOf(request.getDataProcessingAgreements()));
        data.setSubDataProcessing(DataProcessingRequest.convertToDataProcessingNullSafe(request.getSubDataProcessing()));
        data.setPurposeDescription(request.getPurposeDescription());
        data.setDescription(request.getDescription());
        data.setArt9(request.getArt9());
        data.setArt10(request.getArt10());
        data.setRetention(convertRetention(request.getRetention()));
        return this;
    }

    // TODO: Snu avhengigheten innover
    public DpProcessResponse convertToResponse() {
        return DpProcessResponse.builder()
                .id(id)
                .name(data.getName())
                .dpProcessNumber(data.getDpProcessNumber())
                .affiliation(AffiliationResponse.buildFrom(data.getAffiliation()))
                .externalProcessResponsible(getExternalProcessResponsibleCodeResponse())
                .start(data.getStart())
                .end(data.getEnd())
                .dataProcessingAgreements(copyOf(data.getDataProcessingAgreements()))
                .subDataProcessing(DataProcessingResponse.buildFrom(data.getSubDataProcessing()))
                .purposeDescription(data.getPurposeDescription())
                .description(data.getDescription())
                .art9(data.getArt9())
                .art10(data.getArt10())
                .retention(data.getRetention().convertToResponse())
                .changeStamp(convertChangeStampResponse())
                .build();
    }

    // TODO: Snu avhengigheten innover
    // TODO: Skal ikke ha kall til service her.
    private CodelistResponse getExternalProcessResponsibleCodeResponse() {
        return CodelistService.getCodelistResponse(ListName.THIRD_PARTY, data.getExternalProcessResponsible());
    }

    // TODO: Snu avhengigheten innover
    public DpProcessShortResponse convertToShortResponse() {
        return new DpProcessShortResponse(id, data.getName(), AffiliationResponse.buildFrom(data.getAffiliation()));
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class DpProcessBuilder {

        public DpProcessBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

    }

}
