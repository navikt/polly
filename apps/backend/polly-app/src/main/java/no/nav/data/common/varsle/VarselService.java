package no.nav.data.common.varsle;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.security.SecurityProperties;
import no.nav.data.common.varsle.domain.Varsel;
import no.nav.data.common.varsle.domain.Varslingsadresse;
import no.nav.data.integration.slack.SlackService;
import no.nav.data.integration.slack.domain.SlackMeldingData;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VarselService {

    private final SlackService slackService;
    private final SecurityProperties securityProperties;

    public void varsle(List<Varslingsadresse> recipients, Varsel varsel) {
        for (Varslingsadresse varslingsadresse : recipients) {
            switch (varslingsadresse.getType()) {
                case SLACK -> slackService.scheduleSlack(createSlackMeldingData(varsel, varslingsadresse.getAdresse(), true, SlackMeldingData.PRIORITY_LOW));
                default -> throw new NotImplementedException("%s is not an implemented varsel type".formatted(varslingsadresse.getType()));
            }
        };

    }

    private SlackMeldingData createSlackMeldingData(Varsel varsel, String mottager, boolean sendTilKanal, int priority) {
        List<SlackMeldingData.MeldingPart> parts = new ArrayList<>();
        parts.add(SlackMeldingData.MeldingPart.header(varsel.getTitle()));
        varsel.getParagraphs().forEach(p -> parts.add(SlackMeldingData.MeldingPart.text(p.toSlack())));

        return SlackMeldingData.builder()
                .mottager(mottager)
                .prioritet(priority)
                .sendTilKanal(sendTilKanal)
                .parts(parts)
                .build();
    }
}
