package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "PROCESS_DISTRIBUTION")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessDistribution {

    @Id
    @Column(name = "ID", nullable = false, updatable = false, unique = true)
    private UUID id;

    @Column(name = "PROCESS", nullable = false, updatable = false)
    private String process;

    @Column(name = "PURPOSE_CODE", nullable = false, updatable = false)
    private String purposeCode;

    public static ProcessDistribution newForProcess(Process process) {
        return new ProcessDistribution(UUID.randomUUID(), process.getName(), process.getPurposeCode());
    }

    public Process convertToProcess() {
        return Process.builder().name(process).purposeCode(purposeCode).build();
    }

}
