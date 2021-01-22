package no.nav.data.common.jpa;

import lombok.experimental.UtilityClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

@UtilityClass
public class RepoUtil {

    public static <T, ID> void doPaged(JpaRepository<T, ID> repo, int pageSize, Consumer<List<T>> consumer) {
        PageRequest pageable = PageRequest.of(0, pageSize, Sort.by("id"));
        Page<T> page = null;
        do {
            page = repo.findAll(
                    Optional.ofNullable(page)
                            .map(Page::nextPageable)
                            .orElse(pageable)
            );
            consumer.accept(page.getContent());
        } while (page.hasNext());
    }
}
