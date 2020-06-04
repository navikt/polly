package no.nav.data.polly.common.security.dto;

import java.util.List;

public interface UserInfo {

    String getAppId();

    String getUserId();

    String getIdent();

    String getName();

    String getEmail();

    String getAppName();

    String getIdentName();

    List<String> getGroups();

    UserInfoResponse convertToResponse();

}
