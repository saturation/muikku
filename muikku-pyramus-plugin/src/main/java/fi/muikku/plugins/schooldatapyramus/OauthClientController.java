package fi.muikku.plugins.schooldatapyramus;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.joda.time.DateTime;

import fi.muikku.plugins.schooldatapyramus.dao.SystemAccessTokenDAO;
import fi.muikku.plugins.schooldatapyramus.dao.UserAccessTokenDAO;
import fi.muikku.plugins.schooldatapyramus.model.SystemAccessToken;
import fi.muikku.plugins.schooldatapyramus.model.UserAccessToken;
import fi.muikku.plugins.schooldatapyramus.rest.AccessToken;
import fi.muikku.session.SessionController;

@Dependent
public class OauthClientController {
  
  @Inject
  private SystemAccessTokenDAO systemAccessTokenDAO;

  @Inject
  private UserAccessTokenDAO userAccessTokenDAO;
  
  @Inject
  private SessionController sessionController;
  
  public UserAccessToken createUserAccessToken(AccessToken accessToken, String authCode) {
    DateTime accessTokenExpires = new DateTime().plusSeconds(accessToken.getExpiresIn());
    return userAccessTokenDAO.create(accessToken.getAccessToken(), accessTokenExpires.getMillis(), accessToken.getRefreshToken(), sessionController.getLoggedUserEntity().getId(), authCode);
  }
  
  public SystemAccessToken createSystemAccessToken(AccessToken accessToken, String authCode) {
    DateTime accessTokenExpires = new DateTime().plusSeconds(accessToken.getExpiresIn());
    return systemAccessTokenDAO.create(accessToken.getAccessToken(), accessTokenExpires.getMillis(), accessToken.getRefreshToken(), authCode);
  }
  
  public UserAccessToken refreshUserAccessToken(UserAccessToken userAccessToken, AccessToken newAccessToken){ //TODO: change to use refresh token
    DateTime accessTokenExpires = new DateTime().plusSeconds(newAccessToken.getExpiresIn());
    return userAccessTokenDAO.refresh(userAccessToken, newAccessToken.getAccessToken(), accessTokenExpires.getMillis());
  }
  
  public SystemAccessToken refreshSystemAccessToken(SystemAccessToken systemAccessToken, AccessToken newAccessToken){ //TODO: change to use refresh token
    DateTime accessTokenExpires = new DateTime().plusSeconds(newAccessToken.getExpiresIn());
    return systemAccessTokenDAO.refresh(systemAccessToken, newAccessToken.getAccessToken(), accessTokenExpires.getMillis());
  }
  
  public SystemAccessToken findSystemAccessToken(){
    return systemAccessTokenDAO.getSystemAccessToken();
  }
  
  public boolean isExpired(UserAccessToken userAccessToken){
    if(System.currentTimeMillis() > userAccessToken.getExpires()){
      return true;
    }
    return false;
  }
  
  public boolean isExpired(SystemAccessToken systemAccessToken){
    if(System.currentTimeMillis() > systemAccessToken.getExpires()){
      return true;
    }
    return false;
  }

}
