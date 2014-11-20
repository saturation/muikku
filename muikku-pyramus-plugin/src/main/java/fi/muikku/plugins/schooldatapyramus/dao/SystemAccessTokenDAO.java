package fi.muikku.plugins.schooldatapyramus.dao;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusDAO;
import fi.muikku.plugins.schooldatapyramus.model.SystemAccessToken;

public class SystemAccessTokenDAO extends SchoolDataPyramusDAO<SystemAccessToken> {

  private static final long serialVersionUID = 3093191898132041842L;

  public SystemAccessToken create(String accessToken, Long expires, String refreshToken, String authCode){
    SystemAccessToken systemAccessToken = new SystemAccessToken();
    systemAccessToken.setAccessToken(accessToken);
    systemAccessToken.setExpires(expires);
    systemAccessToken.setRefreshToken(refreshToken);
    systemAccessToken.setAuthCode(authCode);
    return persist(systemAccessToken);
  }
  
  public SystemAccessToken refresh(SystemAccessToken systemAccessToken, String accessToken, Long expires){
    systemAccessToken.setAccessToken(accessToken);
    systemAccessToken.setExpires(expires);
    return persist(systemAccessToken);
  }
  
}
