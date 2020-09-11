package no.nav.data.polly.process.domain.repo;

import no.nav.data.polly.process.domain.DpProcess;

import java.util.List;

public interface DpProcessRepositoryCustom {

    List<DpProcess> findByProduct(String product);

    List<DpProcess> findBySubDepartment(String subDepartment);

    List<DpProcess> findByProductTeam(String productTeam);

    List<DpProcess> findByProductTeams(List<String> productTeams);
}
