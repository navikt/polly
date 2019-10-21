package no.nav.polly.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;
import static no.nav.polly.common.utils.StreamUtils.safeStream;

@Data
@Slf4j
@AllArgsConstructor
@NoArgsConstructor
public class Group {

    /**
     * See {@link Type}
     */
    private String type;
    private String name;
    private List<String> members;
    private LdapResult ldapResult;

    public List<String> convertToSystemNames() {
        if (ldapResult == null || !ldapResult.erOk()) {
            log.warn("Feil i ldap oppslag {}", this);
            return emptyList();
        }

        return safeStream(members)
                .map(this::findCn)
                .filter(Objects::nonNull)
                .collect(toList());
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

    public boolean isType(Type otherType) {
        return otherType == getTypeEnum();
    }

    private Type getTypeEnum() {
        try {
            return Type.valueOf(type);
        } catch (IllegalArgumentException e) {
            log.warn("invalid type " + type, e);
            return null;
        }
    }
}
