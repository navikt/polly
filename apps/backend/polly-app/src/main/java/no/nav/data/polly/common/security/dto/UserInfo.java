package no.nav.data.polly.common.security.dto;

import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import lombok.Value;
import no.nav.data.polly.common.security.AppIdMapping;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;

import java.util.List;
import java.util.Set;

import static no.nav.data.polly.common.security.dto.PollyRole.ROLE_PREFIX;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.copyOf;

@Value
public class UserInfo {

    public static final String APPID_CLAIM = "appid";

    private String appId;
    private String subject;
    private String ident;
    private String name;
    private String givenName;
    private String familyName;
    private String email;
    private List<String> groups;

    public UserInfo(UserPrincipal principal, Set<GrantedAuthority> grantedAuthorities, String identClaimName) {
        this.appId = getClaim(principal, APPID_CLAIM);
        this.ident = getIdent(principal, identClaimName);

        this.subject = principal.getSubject();
        this.name = principal.getName();
        this.givenName = getClaim(principal, StandardClaimNames.GIVEN_NAME);
        this.familyName = getClaim(principal, StandardClaimNames.FAMILY_NAME);
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
                .givenName(givenName)
                .familyName(familyName)
                .email(email)
                .groups(copyOf(groups))
                .build();
    }
}
