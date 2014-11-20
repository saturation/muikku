package fi.muikku.plugins.schooldatapyramus;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.joda.time.DateTime;

import fi.muikku.plugins.schooldatapyramus.dao.SystemAccessTokenDAO;
import fi.muikku.plugins.schooldatapyramus.dao.UserAccessTokenDAO;
import fi.muikku.plugins.schooldatapyramus.model.SystemAccessToken;
import fi.muikku.plugins.schooldatapyramus.model.UserAccessToken;
import fi.muikku.plugins.schooldatapyramus.rest.AbstractPyramusClient;
import fi.muikku.plugins.schooldatapyramus.rest.AccessToken;
import fi.muikku.session.SessionController;

@Dependent
public class OauthClientController {

  @Inject
  private SystemAccessTokenDAO systemAccessTokenDAO;

  @Inject
  private UserAccessTokenDAO userAccessTokenDAO;

  @Inject
  private AbstractPyramusClient abstractPyramusClient;
  
  @Inject
  private SessionController sessionController;
  
  public UserAccessToken createUserAccessToken(String authCode) {
    AccessToken accessToken = abstractPyramusClient.createAccessToken(authCode);
    DateTime accessTokenExpires = new DateTime().plusSeconds(accessToken.getExpiresIn());
    return userAccessTokenDAO.create(accessToken.getAccessToken(), accessTokenExpires.getMillis(), accessToken.getRefreshToken(), sessionController.getLoggedUserEntity().getId(), authCode);
  }
  
  public SystemAccessToken createSystemAccessToken(String authCode) {
    AccessToken accessToken = abstractPyramusClient.createAccessToken(authCode);
    DateTime accessTokenExpires = new DateTime().plusSeconds(accessToken.getExpiresIn());
    return systemAccessTokenDAO.create(accessToken.getAccessToken(), accessTokenExpires.getMillis(), accessToken.getRefreshToken(), authCode);
  }
  
  public UserAccessToken refreshUserAccessToken(UserAccessToken userAccessToken){ //TODO: change to use refresh token
    AccessToken accessToken = abstractPyramusClient.createAccessToken(userAccessToken.getAuthCode());
    DateTime accessTokenExpires = new DateTime().plusSeconds(accessToken.getExpiresIn());
    return userAccessTokenDAO.refresh(userAccessToken, accessToken.getAccessToken(), accessTokenExpires.getMillis());
  }
  
  public SystemAccessToken refreshSystemAccessToken(SystemAccessToken systemAccessToken){ //TODO: change to use refresh token
    AccessToken accessToken = abstractPyramusClient.createAccessToken(systemAccessToken.getAuthCode());
    DateTime accessTokenExpires = new DateTime().plusSeconds(accessToken.getExpiresIn());
    return systemAccessTokenDAO.refresh(systemAccessToken, accessToken.getAccessToken(), accessTokenExpires.getMillis());
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
