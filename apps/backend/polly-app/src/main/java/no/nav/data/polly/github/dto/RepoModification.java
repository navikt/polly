package no.nav.data.polly.github.dto;

import lombok.Builder;
import lombok.Data;
import no.nav.data.polly.common.utils.CollectionDifference;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.github.GithubContentConverter;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import org.eclipse.egit.github.core.RepositoryContents;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Comparator.comparing;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;
import static no.nav.data.polly.informationtype.domain.InformationTypeMaster.GITHUB;

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

        CollectionDifference<InformationTypeRequest> difference = StreamUtils.difference(previousItems, currentItems, comparing(InformationTypeRequest::getIdentifyingFields));
        InformationTypeRequest.initiateRequests(difference.getRemoved(), true, GITHUB);
        InformationTypeRequest.initiateRequests(difference.getShared(), true, GITHUB);
        InformationTypeRequest.initiateRequests(difference.getAdded(), false, GITHUB);
        return difference;
    }

    private List<InformationTypeRequest> mapToInformationTypeRequest(List<RepositoryContents> contentsOne, List<RepositoryContents> contentsTwo) {
        return Stream.concat(safeStream(contentsOne), safeStream(contentsTwo))
                .map(GithubContentConverter::convertFromGithubFile)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }
}
