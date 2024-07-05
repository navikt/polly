package no.nav.data.polly.processor.domain;

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
import no.nav.data.polly.processor.dto.ProcessorRequest;
import org.hibernate.annotations.Type;

import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.copyOf;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "PROCESSOR")
public class Processor extends Auditable {

    @Id
    @Column(name = "PROCESSOR_ID")
    private UUID id;

    @Valid
    @Builder.Default
    @NotNull
    @Type(value = JsonBinaryType.class)
    @Column(name = "DATA", nullable = false)
    private ProcessorData data = new ProcessorData();

    // TODO: Snu avhengigheten innover
    public Processor convertFromRequest(ProcessorRequest request) {
        if (!request.isUpdate()) {
            id = UUID.randomUUID();
        }

        data.setName(request.getName());
        data.setContract(request.getContract());
        data.setContractOwner(request.getContractOwner());
        data.setOperationalContractManagers(copyOf(request.getOperationalContractManagers()));
        data.setNote(request.getNote());

        data.setOutsideEU(request.getOutsideEU());
        data.setTransferGroundsOutsideEU(request.getTransferGroundsOutsideEU());
        data.setTransferGroundsOutsideEUOther(request.getTransferGroundsOutsideEUOther());
        data.setCountries(copyOf(request.getCountries()));

        return this;
    }

    public UsedInInstance getInstanceIdentification() {
        return new UsedInInstance(id.toString(), data.getName());
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class ProcessorBuilder {

        public ProcessorBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

    }
}
