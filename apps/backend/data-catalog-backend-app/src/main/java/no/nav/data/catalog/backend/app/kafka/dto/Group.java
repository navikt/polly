package no.nav.data.catalog.backend.app.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.safeStream;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Group {

    private Type type;
    private String name;
    private List<String> members;
    private LdapResult ldapResult;

    public List<String> convertToSystemNames() {
        return safeStream(members)
                .map(this::findCn)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private String findCn(String member) {
        if (StringUtils.isBlank(member)) {
            return null;
        }
        String[] split = member.split(",");
        return Stream.of(split)
                .filter(string -> string.startsWith("CN="))
                .findFirst()
                .map(string -> StringUtils.substringAfter(string, "CN="))
                .orElse(null);
    }
}
