package no.nav.data.polly.process.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiUsageDescription {
    private Boolean aiUsage;
    private String description;
    private Boolean reusingPersonalInformation;
    private LocalDate startDate;
    private LocalDate endDate;
    private String registryNumber;
}
