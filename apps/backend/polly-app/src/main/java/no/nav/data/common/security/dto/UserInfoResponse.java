package no.nav.data.common.security.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"loggedIn", "ident", "name", "email", "groups"})
public class UserInfoResponse {

    private boolean loggedIn;
    private String ident;
    private String name;
    private String email;
    private List<String> groups = new ArrayList<>();

    public static UserInfoResponse noUser(boolean securityEnabled) {
        var responseBuilder = UserInfoResponse.builder().loggedIn(false)
                .pollyRole(PollyRole.POLLY_READ);
        if (!securityEnabled) {
            responseBuilder
                    .pollyRole(PollyRole.POLLY_WRITE)
                    .pollyRole(PollyRole.POLLY_ADMIN)
                    .name("Anon")
                    .ident("x000000");
        }
        return responseBuilder.build();
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class UserInfoResponseBuilder {

        private List<String> groups = new ArrayList<>();

        public UserInfoResponseBuilder pollyRole(PollyRole pollyRole) {
            this.groups.add(pollyRole.name());
            return this;
        }
    }
}
