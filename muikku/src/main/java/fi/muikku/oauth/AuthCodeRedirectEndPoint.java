package fi.muikku.oauth;

import java.io.IOException;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.oltu.oauth2.client.response.OAuthAuthzResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import java.util.logging.Level;

@WebServlet("/AuthCodeRedirect")
public class AuthCodeRedirectEndPoint extends HttpServlet {  

  private static final long serialVersionUID = 4526135190760868361L;

  @Inject
  private Logger logger;
  
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
    try {
      OAuthAuthzResponse authResponse = OAuthAuthzResponse.oauthCodeAuthzResponse(req);
      String authCode = authResponse.getCode();
      //TODO: save auth code
      
    } catch (OAuthProblemException e) {
      logger.log(Level.SEVERE, "Failed to parse authorization code from response");
    }
    
	}

}
