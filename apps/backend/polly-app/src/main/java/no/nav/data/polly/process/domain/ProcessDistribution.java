package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;
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

    public static ProcessDistribution newForPurpose(String process, String purpose) {
        return new ProcessDistribution(UUID.randomUUID(), process, purpose);
    }

    public Process convertToProcess() {
        return new Process(null, process, purposeCode, List.of(), Set.of());
    }
}
