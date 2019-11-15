package no.nav.data.polly.common.security.dto;

import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import lombok.Value;
import no.nav.data.polly.common.security.AppIdMapping;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;

import java.util.List;
import java.util.Set;

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.copyOf;

@Value
public class UserInfo {

    public static final String APPID_CLAIM = "appid";
    public static final String NAV_IDENT_CLAIM = "NAVident";

    private String appId;
    private String subject;
    private String navIdent;
    private String name;
    private String givenName;
    private String familyName;
    private String email;
    private List<String> groups;

    public UserInfo(UserPrincipal principal, Set<GrantedAuthority> grantedAuthorities) {
        this.appId = getClaim(principal, APPID_CLAIM);
        this.navIdent = getNAVident(principal);

        this.subject = principal.getSubject();
        this.name = principal.getName();
        this.givenName = getClaim(principal, StandardClaimNames.GIVEN_NAME);
        this.familyName = getClaim(principal, StandardClaimNames.FAMILY_NAME);
        this.email = principal.getUniqueName();

        groups = convert(grantedAuthorities, grantedAuthority -> StringUtils.substringAfter(grantedAuthority.getAuthority(), "ROLE_"));
    }

    public String formatUser() {
        return String.format("%s - %s", navIdent, name);
    }

    public String getAppName() {
        return AppIdMapping.getAppNameForAppId(appId);
    }

    private static String getNAVident(UserPrincipal principal) {
        String navClaim = getClaim(principal, NAV_IDENT_CLAIM);
        return navClaim == null ? "missing-ident" : navClaim;
    }

    @SuppressWarnings("unchecked")
    private static <T> T getClaim(UserPrincipal principal, String claim) {
        return (T) principal.getClaim(claim);
    }

    public UserInfoResponse convertToResponse() {
        return UserInfoResponse.builder()
                .loggedIn(true)
                .navIdent(navIdent)
                .name(name)
                .givenName(givenName)
                .familyName(familyName)
                .email(email)
                .groups(copyOf(groups))
                .build();
    }
}
