package no.nav.data.polly.process.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DataProcessing implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Boolean dataProcessor;
    private List<UUID> processors;

}
