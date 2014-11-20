package fi.muikku.oauth;

import java.io.IOException;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.oltu.oauth2.client.response.OAuthAuthzResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;

import fi.muikku.events.AuthCodeReceivedEvent;
import fi.muikku.model.users.UserEntity;
import fi.muikku.session.SessionController;

import java.util.logging.Level;

@WebServlet("/AuthCodeRedirect")
public class AuthCodeRedirectEndPoint extends HttpServlet {

  private static final long serialVersionUID = 4526135190760868361L;

  @Inject
  private Logger logger;

  @Inject
  private Event<AuthCodeReceivedEvent> authCodeReceivedEvent;

  @Inject
  private SessionController sessionController;

  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();

    try {
      OAuthAuthzResponse authResponse = OAuthAuthzResponse.oauthCodeAuthzResponse(req);
      String authCode = authResponse.getCode();
      if (loggedUserEntity != null) {
        authCodeReceivedEvent.fire(new AuthCodeReceivedEvent(authCode, loggedUserEntity.getId()));
      } else {
        authCodeReceivedEvent.fire(new AuthCodeReceivedEvent(authCode, -1));
      }

    } catch (OAuthProblemException e) {
      logger.log(Level.SEVERE, "Failed to parse authorization code from response");
    }
  }

}
