package no.nav.data.polly.codelist.commoncode.nav.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommonCodeList {

    private Map<String, List<CommonCode>> betydninger;
}
