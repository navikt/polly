package no.nav.data.polly.processor.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.polly.codelist.dto.UsedInInstance;
import no.nav.data.polly.processor.dto.ProcessorRequest;
import no.nav.data.polly.processor.dto.ProcessorResponse;
import org.hibernate.annotations.Type;

import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

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
    @Type(type = "pg-uuid")
    @Column(name = "PROCESSOR_ID")
    private UUID id;

    @Valid
    @Builder.Default
    @NotNull
    @Type(type = "jsonb")
    @Column(name = "DATA", nullable = false)
    private ProcessorData data = new ProcessorData();

    public ProcessorResponse convertToResponse() {
        return ProcessorResponse.builder()
                .id(id)
                .name(data.getName())
                .contract(data.getContract())
                .contractOwner(data.getContractOwner())
                .operationalContractManagers(copyOf(data.getOperationalContractManagers()))
                .note(data.getNote())
                .transferGroundsOutsideEU(data.getTransferGroundsOutsideEUCodeResponse())
                .transferGroundsOutsideEUOther(data.getTransferGroundsOutsideEUOther())
                .outsideEU(data.getOutsideEU())
                .countries(data.getCountries())
                .changeStamp(convertChangeStampResponse())
                .build();
    }

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
