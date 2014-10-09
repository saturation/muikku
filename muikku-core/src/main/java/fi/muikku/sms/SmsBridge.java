package fi.muikku.sms;

public interface SmsBridge {
  
  void sendSms(String phoneNumber, String message) throws SmsException;

}
