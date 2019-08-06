package no.nav.data.catalog.backend.app.github.domain;

import static java.util.Comparator.comparing;
import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.safeStream;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.Builder;
import lombok.Data;
import no.nav.data.catalog.backend.app.common.utils.CollectionDifference;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import org.eclipse.egit.github.core.RepositoryContents;

@Builder
@Data
public class RepoModification {

    private String head;
    private List<RepositoryContents> added;
    private List<RepositoryContents> modifiedBefore;
    private List<RepositoryContents> modifiedAfter;
    private List<RepositoryContents> deleted;

    public int size() {
        return added.size() + modifiedBefore.size() + modifiedAfter.size() + deleted.size();
    }

    public CollectionDifference<InformationTypeRequest> toChangelist() {
        List<InformationTypeRequest> previousItems = mapToInformationTypeRequest(deleted, modifiedBefore);
        List<InformationTypeRequest> currentItems = mapToInformationTypeRequest(added, modifiedAfter);

        return StreamUtils.difference(previousItems, currentItems, comparing(InformationTypeRequest::getName));
    }

    private List<InformationTypeRequest> mapToInformationTypeRequest(List<RepositoryContents> contentsOne, List<RepositoryContents> contentsTwo) {
        return Stream.concat(safeStream(contentsOne), safeStream(contentsTwo))
                .map(InformationTypeRequest::convertFromGithubFile)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }
}
