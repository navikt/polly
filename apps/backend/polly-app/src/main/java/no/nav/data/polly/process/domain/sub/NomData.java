package no.nav.data.polly.process.domain.sub;

import java.io.Serial;
import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NomData implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String nomId;
    private String nomName;
}
