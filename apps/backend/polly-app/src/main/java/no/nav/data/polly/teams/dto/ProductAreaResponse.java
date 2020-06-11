package no.nav.data.polly.teams.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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


}
