package fi.muikku.plugins.schooldatapyramus;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.events.AuthCodeReceivedEvent;
import fi.muikku.session.SessionController;

public class AuthCodeListener {

  @Inject
  private SessionController sessionController;

  @Inject
  private OauthClientController oauthClientController;

  public void authCodeReceived(@Observes AuthCodeReceivedEvent event) {
    if (event.getUserEntityId() == sessionController.getLoggedUserEntity().getId()) {
      oauthClientController.createUserAccessToken(event.getAuthCode());
    } else if (event.getUserEntityId() == -1) {
      oauthClientController.createSystemAccessToken(event.getAuthCode());
    }

  }

}
