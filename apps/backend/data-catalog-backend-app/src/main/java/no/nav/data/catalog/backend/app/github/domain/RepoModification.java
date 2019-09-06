package no.nav.data.catalog.backend.app.github.domain;

import lombok.Builder;
import lombok.Data;
import no.nav.data.catalog.backend.app.common.utils.CollectionDifference;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import no.nav.data.catalog.backend.app.dataset.DatasetMaster;
import no.nav.data.catalog.backend.app.dataset.DatasetRequest;
import org.eclipse.egit.github.core.RepositoryContents;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Comparator.comparing;
import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.safeStream;

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

    public CollectionDifference<DatasetRequest> toChangelist() {
        List<DatasetRequest> previousItems = mapToDatasetRequest(deleted, modifiedBefore);
        List<DatasetRequest> currentItems = mapToDatasetRequest(added, modifiedAfter);

        CollectionDifference<DatasetRequest> difference = StreamUtils.difference(previousItems, currentItems, comparing(DatasetRequest::getTitle));
        DatasetRequest.initiateRequests(difference.getRemoved(), true, DatasetMaster.GITHUB);
        DatasetRequest.initiateRequests(difference.getShared(), true, DatasetMaster.GITHUB);
        DatasetRequest.initiateRequests(difference.getAdded(), false, DatasetMaster.GITHUB);
        return difference;
    }

    private List<DatasetRequest> mapToDatasetRequest(List<RepositoryContents> contentsOne, List<RepositoryContents> contentsTwo) {
        return Stream.concat(safeStream(contentsOne), safeStream(contentsTwo))
                .map(DatasetRequest::convertFromGithubFile)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }
}
