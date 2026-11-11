package no.nav.data.polly.databehandler.domain;

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
import no.nav.data.polly.codelist.dto.UsedInInstance;
import no.nav.data.polly.databehandler.dto.DatabehandlerRequest;
import org.hibernate.annotations.Type;

import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.copyOf;

@Data
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DATABEHANDLER")
public class Databehandler extends Auditable {

    @Id
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Valid
    @Builder.Default
    @NotNull
    @Type(value = JsonBinaryType.class)
    @Column(name = "DATA", nullable = false)
    private DatabehandlerData data = new DatabehandlerData();

    // TODO: Snu avhengigheten innover
    public Databehandler convertFromRequest(DatabehandlerRequest request) {
        data.setNavn(request.getNavn());
        data.setAvtalereferanse(request.getAvtalereferanse());
        data.setAvtaleeier(request.getAvtaleeier());
        data.setFagansvarlig(copyOf(request.getFagansvarlig()));
        data.setMerknad(request.getMerknad());
        data.setBehandlingUtenforEuEos(request.getBehandlingUtenforEuEos());
        data.setOverforingsgrunnlagUtenforEuEos(request.getOverforingsgrunnlagUtenforEuEos());
        data.setOverforingsgrunnlagUtenforEuEosAnnet(request.getOverforingsgrunnlagUtenforEuEosAnnet());
        data.setLandDataOverforesTil(copyOf(request.getLandDataOverforesTil()));
        // Version skal aldri koieres fra request til entity.

        return this;
    }

    public UsedInInstance getInstanceIdentification() {
        return new UsedInInstance(id.toString(), data.getNavn());
    }

}
