package no.nav.data.polly.codelist.commoncode.nav.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommonCode {

    private LocalDate gyldigFra;
    private LocalDate gyldigTil;
    private Map<String, Description> beskrivelser;


    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Description {

        private String term;
        private String tekst;
    }
}
