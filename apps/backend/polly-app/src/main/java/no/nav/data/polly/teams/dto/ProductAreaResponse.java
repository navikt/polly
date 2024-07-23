package no.nav.data.polly.teams.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.teams.domain.ProductArea;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.convert;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "tags", "members"})
public class ProductAreaResponse {

    private String id;
    private String name;
    private String description;
    private List<String> tags;
    private List<MemberResponse> members;

    public static ProductAreaResponse buildFrom(ProductArea pa) {
        return ProductAreaResponse.builder()
                .id(pa.getId())
                .name(pa.getName())
                .description(pa.getDescription())
                .tags(pa.getTags())
                .build();
    }

    public static ProductAreaResponse buildFromWithMembers(ProductArea pa) {
        var resp = buildFrom(pa);
        resp.setMembers(convert(pa.getMembers(), MemberResponse::buildFrom));
        return resp;
    }

}
