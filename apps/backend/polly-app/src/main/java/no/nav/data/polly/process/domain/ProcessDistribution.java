package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

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

    @Type(type = "jsonb")
    @Column(name = "DATA", nullable = false, updatable = false)
    private ProcessDistributionData data;

    public static ProcessDistribution newForProcess(Process process) {
        return new ProcessDistribution(UUID.randomUUID(), new ProcessDistributionData(process.getId()));
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProcessDistributionData {

        private UUID processId;
    }

}
