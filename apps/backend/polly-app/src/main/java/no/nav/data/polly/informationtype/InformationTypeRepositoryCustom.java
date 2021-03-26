package no.nav.data.polly.informationtype;

import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;

import java.util.List;

public interface InformationTypeRepositoryCustom {

    List<InformationType> findByCategory(String category);

    List<InformationType> findBySource(String source);

    List<InformationType> findByProductTeam(String productTeam);

    List<InformationType> findByProductTeams(List<String> productTeams);

    List<InformationTypeShortResponse> findAllShort();
}
