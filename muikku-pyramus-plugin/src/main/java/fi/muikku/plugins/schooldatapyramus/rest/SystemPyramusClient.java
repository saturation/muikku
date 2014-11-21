package fi.muikku.plugins.schooldatapyramus.rest;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Client;

import org.joda.time.DateTime;

import fi.muikku.plugins.schooldatapyramus.OauthClientController;
import fi.muikku.plugins.schooldatapyramus.model.SystemAccessToken;

@ApplicationScoped
public class SystemPyramusClient extends AbstractPyramusClient {

  @Inject
  private OauthClientController oauthClientController;

  @PostConstruct
  public void init() {
    accessToken = null;
    authCode = null;
    waitingCode = false;
    accessTokenExpires = null;
    pooledClients = new ArrayList<>();
  }

  @PreDestroy
  public void deinit() {
    for (Client pooledClient : pooledClients) {
      pooledClient.close();
    }
  }

  @Override
  protected synchronized String getAccessToken() {
    if (((accessToken == null) || (accessTokenExpires == null)) || (accessTokenExpires.isBefore(System.currentTimeMillis()))) {
      SystemAccessToken systemAccessToken = oauthClientController.findSystemAccessToken();
      if (systemAccessToken == null) {
        if (authCode == null && !waitingCode) {
          requestAuthCode();
        } else if (authCode != null) {
          waitingCode = false;
          AccessToken createdAccessToken = createAccessToken(authCode);
          accessToken = createdAccessToken.getAccessToken();
          accessTokenExpires = new DateTime().plusSeconds(createdAccessToken.getExpiresIn());
          oauthClientController.createSystemAccessToken(createdAccessToken, authCode);
        }
      } else {
        if (oauthClientController.isExpired(systemAccessToken)) {
          AccessToken createdAccessToken = createAccessToken(systemAccessToken.getAuthCode());
          accessToken = createdAccessToken.getAccessToken();
          accessTokenExpires = new DateTime().plusSeconds(createdAccessToken.getExpiresIn());
          oauthClientController.refreshSystemAccessToken(systemAccessToken, createdAccessToken);
        } else {
          accessToken = systemAccessToken.getAccessToken();
          accessTokenExpires = new DateTime(systemAccessToken.getExpires());
        }

      }
    }

    // TODO: Change to refresh token when such is available in Pyramus

    return accessToken;
  }

  @Override
  protected synchronized Client obtainClient() {
    if (pooledClients.isEmpty()) {
      return buildClient();
    }

    return pooledClients.remove(pooledClients.size() - 1);
  }

  @Override
  protected synchronized void releaseClient(Client client) {
    pooledClients.add(client);
  }

  public String getAuthCode() {
    return authCode;
  }

  public void setAuthCode(String authCode) {
    this.authCode = authCode;
  }

  private List<Client> pooledClients;
  private String accessToken;
  private DateTime accessTokenExpires;
  private String authCode;
  private boolean waitingCode;
}
