package no.nav.data.polly.common.security.dto;

import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import lombok.Value;
import no.nav.data.polly.common.security.AppIdMapping;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Set;

import static no.nav.data.polly.common.security.SecurityConstants.APPID_CLAIM;
import static no.nav.data.polly.common.security.dto.PollyRole.ROLE_PREFIX;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.copyOf;

@Value
public class UserInfo {

    String appId;
    String ident;
    String name;
    String email;
    List<String> groups;

    public UserInfo(UserPrincipal principal, Set<GrantedAuthority> grantedAuthorities, String identClaimName) {
        this.appId = getClaim(principal, APPID_CLAIM);
        this.ident = getIdent(principal, identClaimName);

        this.name = principal.getName();
        this.email = principal.getUniqueName();

        groups = convert(grantedAuthorities, grantedAuthority -> StringUtils.substringAfter(grantedAuthority.getAuthority(), ROLE_PREFIX));
    }

    public String formatUser() {
        return String.format("%s - %s", ident, name);
    }

    public String getAppName() {
        return AppIdMapping.getAppNameForAppId(appId);
    }

    private static String getIdent(UserPrincipal principal, String identClaimName) {
        String identClaim = getClaim(principal, identClaimName);
        return identClaim == null ? "missing-ident" : identClaim;
    }

    @SuppressWarnings("unchecked")
    private static <T> T getClaim(UserPrincipal principal, String claim) {
        return (T) principal.getClaim(claim);
    }

    public UserInfoResponse convertToResponse() {
        return UserInfoResponse.builder()
                .loggedIn(true)
                .ident(ident)
                .name(name)
                .email(email)
                .groups(copyOf(groups))
                .build();
    }
}
