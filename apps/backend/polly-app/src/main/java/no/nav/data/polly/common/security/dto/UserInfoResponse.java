package no.nav.data.polly.common.security.dto;

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
@JsonPropertyOrder({"navIdent", "name", "givenName", "familyName", "email", "groups"})
public class UserInfoResponse {

    private String navIdent;
    private String name;
    private String givenName;
    private String familyName;
    private String email;
    private List<String> groups;

}
