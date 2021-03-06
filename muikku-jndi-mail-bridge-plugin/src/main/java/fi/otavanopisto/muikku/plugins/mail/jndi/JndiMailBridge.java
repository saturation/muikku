package fi.otavanopisto.muikku.plugins.mail.jndi;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.mail.MailAttachment;
import fi.otavanopisto.muikku.mail.MailBridge;
import fi.otavanopisto.muikku.mail.MailType;

@ApplicationScoped
public class JndiMailBridge implements MailBridge {

  @Inject
  private Event<JndiMailEvent> jndiMailEvent;
  
  @Override
  public void sendMail(MailType mimeType, String from, List<String> to, List<String> cc, List<String> bcc, String subject, String content, List<MailAttachment> attachments) {
    jndiMailEvent.fire(new JndiMailEvent(mimeType, from, to, cc, bcc, subject, content, attachments));
  }

}
