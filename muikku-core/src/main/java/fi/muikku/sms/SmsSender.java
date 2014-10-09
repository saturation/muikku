package fi.muikku.sms;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

@RequestScoped
public class SmsSender {

  @Inject
  private SmsBridge bridge;

  public void sendSms(String phoneNumber, String message) throws SmsException {
    bridge.sendSms(phoneNumber, message);
  }

}
