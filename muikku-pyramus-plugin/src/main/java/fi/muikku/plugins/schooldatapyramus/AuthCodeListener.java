package fi.muikku.plugins.schooldatapyramus;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.events.AuthCodeReceivedEvent;
import fi.muikku.plugins.schooldatapyramus.rest.SystemPyramusClient;
import fi.muikku.session.SessionController;

public class AuthCodeListener {

  @Inject
  private SessionController sessionController;

  @Inject
  private SystemPyramusClient systemPyramusClient;

  @Inject
  private Logger logger;
  
  public void authCodeReceived(@Observes AuthCodeReceivedEvent event) {
    logger.log(Level.INFO, "Received authCode response");
    if (event.getUserEntityId() == sessionController.getLoggedUserEntity().getId()) {
      //TODO: implement
    } else if (event.getUserEntityId() == -1) {
      systemPyramusClient.setAuthCode(event.getAuthCode());
    }

  }

}
