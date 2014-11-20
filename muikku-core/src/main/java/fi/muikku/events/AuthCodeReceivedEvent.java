package fi.muikku.events;

import java.io.Serializable;

public class AuthCodeReceivedEvent implements Serializable {

  private static final long serialVersionUID = 1022918787649190657L;

  public AuthCodeReceivedEvent(String authCode, long userEntityId) {
    this.authCode = authCode;
    this.userEntityId = userEntityId;
  }

  public String getAuthCode() {
    return authCode;
  }

  public void setAuthCode(String authCode) {
    this.authCode = authCode;
  }

  public long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(long userEntityId) {
    this.userEntityId = userEntityId;
  }

  private String authCode;
  private long userEntityId;
}
