package fi.muikku.plugins.schooldatapyramus.dao;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusDAO;
import fi.muikku.plugins.schooldatapyramus.model.SystemAccessToken;
import fi.muikku.plugins.schooldatapyramus.model.UserAccessToken;

public class UserAccessTokenDAO extends SchoolDataPyramusDAO<UserAccessToken> {

  private static final long serialVersionUID = -4936364795578788872L;

  public UserAccessToken create(String accessToken, long expires, String refreshToken, Long userEntityId, String authCode){
    UserAccessToken userAccessToken = new UserAccessToken();
    userAccessToken.setAccessToken(accessToken);
    userAccessToken.setExpires(expires);
    userAccessToken.setRefreshToken(refreshToken);
    userAccessToken.setUserEntityId(userEntityId);
    userAccessToken.setAuthCode(authCode);
    return persist(userAccessToken);
  }
  
  public UserAccessToken refresh(UserAccessToken userAccessToken, String accessToken, Long expires){
    userAccessToken.setAccessToken(accessToken);
    userAccessToken.setExpires(expires);
    return persist(userAccessToken);
  }
  
}
