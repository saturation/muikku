package fi.muikku.plugins.announcer;

import javax.inject.Inject;

import org.joda.time.LocalDate;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.announcer.dao.AnnouncementDAO;
import fi.muikku.plugins.announcer.model.Announcement;

public class AnnouncementController {
  
  @Inject
  private AnnouncementDAO announcementDAO;
  
  public Announcement create(
      String caption,
      String content,
      UserEntity publisher
  ) {
    return announcementDAO.create(
        caption,
        content,
        new LocalDate(),
        publisher.getId()
    );
  }
}
