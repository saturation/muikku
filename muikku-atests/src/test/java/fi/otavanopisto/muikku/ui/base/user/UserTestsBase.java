package fi.otavanopisto.muikku.ui.base.user;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class UserTestsBase extends AbstractUITest {

  @Test
  public void usernameVisibleInResetPasswordViewTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStaffMember(admin)
        .addStudent(student)
        .mockLogin(admin)
        .build();
      
      login();
      
      createPasswordChange(student.getEmail());
      logout();
      navigate("/forgotpassword/reset?h=testtesttest", false);
      waitForPresent(".username-container");
      assertEquals("test", getAttributeValue(".username-container input", "value"));
    }finally {
      deletePasswordChange(student.getEmail());
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void changeLocaleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStaffMember(admin)
        .addStudent(student)
        .mockLogin(admin)
        .build();
      
      login();
      waitForPresent(".ordered-container__item--workspaces .text__panel-title");
      String worspaceTitleText = getWebDriver().findElement(By.cssSelector(".ordered-container__item--workspaces .text__panel-title")).getText();
      if(worspaceTitleText.equalsIgnoreCase("Työtilat")) {
        waitAndClick(".button-pill--current-language");
        waitForPresent(".dropdown--language-picker");
        waitForPresent(".ordered-container__item--workspaces .text__panel-title");
        waitAndClick("div.dropdown--language-picker div.dropdown__container div:nth-child(2) > a > span");
        waitForPresent(".ordered-container__item--workspaces .text__panel-title");
        assertTextIgnoreCase(".ordered-container__item--workspaces .text__panel-title", "Workspaces");
      }else {
        waitAndClick(".button-pill--current-language");
        waitForPresent(".dropdown--language-picker");
        waitForPresent(".ordered-container__item--workspaces .text__panel-title");
        waitAndClick("div.dropdown--language-picker div.dropdown__container div:nth-child(2) > a > span");
        waitForPresent(".ordered-container__item--workspaces .text__panel-title");
        assertTextIgnoreCase(".ordered-container__item--workspaces .text__panel-title", "Työtilat");
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
}
