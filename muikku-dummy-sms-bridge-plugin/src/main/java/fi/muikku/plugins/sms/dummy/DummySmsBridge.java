package fi.muikku.plugins.sms.dummy;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.sms.SmsBridge;
import fi.muikku.sms.SmsException;

@RequestScoped
public class DummySmsBridge implements SmsBridge {

  @Inject
  private Logger logger;

  @Override
  public void sendSms(String phoneNumber, String message) throws SmsException {
    logger.log(Level.INFO, message + " is sent to " + phoneNumber);
  }

}
