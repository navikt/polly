package no.nav.data.common.auditing.domain;

import com.fasterxml.jackson.databind.JsonNode;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.auditing.dto.AuditResponse;
import no.nav.data.common.auditing.event.EventResponse;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.Process;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldNameConstants
@Table(name = "AUDIT_VERSION")
public class AuditVersion {

    @Id
    @Column(name = "AUDIT_ID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTION", nullable = false, updatable = false)
    private Action action;

    @Column(name = "TABLE_NAME", nullable = false, updatable = false)
    private String table;

    @Column(name = "TABLE_ID", nullable = false, updatable = false)
    private String tableId;

    @Column(name = "TIME", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime time = LocalDateTime.now();

    @Column(name = "USER_ID", nullable = false, updatable = false)
    private String user;

    @Type(value = JsonBinaryType.class)
    @Column(name = "DATA", nullable = false, updatable = false)
    private String data;

    public AuditResponse convertToResponse() {
        return AuditResponse.builder()
                .id(id.toString())
                .action(action)
                .table(table)
                .tableId(tableId)
                .time(time)
                .user(user)
                .data(JsonUtils.toJsonNode(data))
                .build();
    }

    public EventResponse convertToEventResponse() {
        return EventResponse.builder()
                .id(id.toString())
                .name(findName())
                .action(action)
                .table(table)
                .tableId(tableId)
                .time(time)
                .build();
    }

    private String findName() {
        JsonNode json = JsonUtils.toJsonNode(data);
        if (table.equals(tableName(Policy.class))) {
            List<String> purposes = getPurposes(json);
            return String.join(", ", purposes) + " - " + json.get("informationTypeName").textValue();
        } else if (table.equals(tableName(Process.class))) {
            List<String> purposes = getPurposes(json);
            return String.join(", ", purposes) + " - " + findName(json);
        }
        return findName(json);
    }

    private String findName(JsonNode json) {
        return json.has("name") ?
                json.get("name").textValue() :
                Optional.ofNullable(json.get("data"))
                        .map(dataField -> dataField.get("name"))
                        .map(JsonNode::textValue)
                        .orElse("");
    }

    private List<String> getPurposes(JsonNode json) {
        var purposesNewFormat = Optional.ofNullable(json.get("data").get("purposes"))
                .map(JsonNode::elements).stream()
                .flatMap(e -> StreamSupport.stream(Spliterators.spliteratorUnknownSize(e, Spliterator.ORDERED), false))
                .map(JsonNode::textValue)
                .collect(Collectors.toList());
        // object.purposeCode old format
        var purposes = purposesNewFormat.isEmpty() ? Optional.ofNullable(json.get("purposeCode")).map(JsonNode::textValue).map(List::of).orElse(List.of()) : purposesNewFormat;
        return purposes.stream()
                .map(purpose -> {
                    Codelist codelist = CodelistService.getCodelist(ListName.PURPOSE, purpose);
                    return codelist == null ? purpose : codelist.getShortName();
                })
                .collect(Collectors.toList());
    }

    public static String tableName(Class<? extends Auditable> aClass) {
        return aClass.getAnnotation(Table.class).name();
    }

}
