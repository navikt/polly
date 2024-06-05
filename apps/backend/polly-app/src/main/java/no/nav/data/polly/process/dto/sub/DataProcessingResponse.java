package no.nav.data.polly.process.dto.sub;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.process.domain.sub.DataProcessing;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.copyOf;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"dataProcessor", "processors"})
public class DataProcessingResponse {

    private Boolean dataProcessor;
    @Singular
    private List<UUID> processors;

    public static DataProcessingResponse buildFrom(DataProcessing dp) {
        return DataProcessingResponse.builder()
                .dataProcessor(dp.getDataProcessor())
                .processors(copyOf(dp.getProcessors()))
                .build();
    }

}
