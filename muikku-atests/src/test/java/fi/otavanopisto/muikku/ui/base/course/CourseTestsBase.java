package fi.otavanopisto.muikku.ui.base.course;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CourseTestsBase extends AbstractUITest {
  
  @Test
  public void courseExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForElementToBePresent(By.className("workspace-title"));
      boolean elementExists = getWebDriver().findElements(By.className("workspace-title")).size() > 0;
      assertTrue(elementExists);
    }finally{
      deleteWorkspace(workspace.getId());  
      WireMock.reset();
    }
  }

  @Test
  public void courseHomeButtonExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
      boolean elementExists = getWebDriver().findElements(By.cssSelector("a.icon-home-workspace")).size() > 0;

      assertTrue(elementExists);
    }finally{
      deleteWorkspace(workspace.getId());  
      WireMock.reset();
    }
  }
 
  @Test
  public void courseGuideButtonExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
      boolean elementExists = getWebDriver().findElements(By.cssSelector("a.icon-guides")).size() > 0;

      assertTrue(elementExists);
    }finally{
      WireMock.reset();
      deleteWorkspace(workspace.getId());  
    }
  }
  
  @Test
  public void courseMaterialButtonTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForElementToBePresent(By.className("workspace-title"));
      boolean elementExists = getWebDriver().findElements(By.cssSelector("a.icon-materials")).size() > 0;

      assertTrue(elementExists);
    }finally{
      WireMock.reset();
      deleteWorkspace(workspace.getId());  
    }
  }
  
  @Test
  public void courseDiscussionButtonTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForElementToBePresent(By.className("workspace-title"));
      boolean elementExists = getWebDriver().findElements(By.cssSelector("a.icon-bubble")).size() > 0;
      
      assertTrue(elementExists);
    }finally{
      WireMock.reset();
      deleteWorkspace(workspace.getId());  
    }
  }

  @Test
  public void courseStudentsAndTeachersButtonTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForElementToBePresent(By.className("workspace-title"));
      boolean elementExists = getWebDriver().findElements(By.cssSelector("a.icon-members")).size() > 0;
      
      assertTrue(elementExists);
    }finally{
      WireMock.reset();
      deleteWorkspace(workspace.getId());  
    }
  }
  
  @Test
  public void courseJournalButtonTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForElementToBePresent(By.className("workspace-title"));
      boolean elementExists = getWebDriver().findElements(By.cssSelector("a.icon-journal")).size() > 0;
      WireMock.reset();
      assertTrue(elementExists);
    }finally{
      WireMock.reset();
      deleteWorkspace(workspace.getId());  
    }
  }
  
  @Test
  public void courseUnpublishTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForPresent(".workspace-title");
      assertVisible(".workspace-unpublish-button");
      assertNotVisible(".workspace-publish-button");
      click(".workspace-unpublish-button");
      waitForPresent(".workspace-title");
      assertNotVisible(".workspace-unpublish-button");
      assertVisible(".workspace-publish-button");      
    }finally{
      WireMock.reset();
      deleteWorkspace(workspace.getId());  
    }
  }

  @Test
  public void courseProgressWidgetsExistsTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Long courseId = 1l;
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      login();
      Workspace workspace = createWorkspace("testcourses", "test course for testing", String.valueOf(courseId), Boolean.TRUE);

      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .build();

      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
        "EVALUATED");

      WorkspaceHtmlMaterial htmlMaterial2 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
          "EXERCISE");
      logout();
      try{
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        
        waitForElementToBePresent(By.className("workspace-title"));
        waitForPresent(".materials-progress-evaluated-status");
        boolean evaluatedExists = getWebDriver().findElements(By.cssSelector(".materials-progress-evaluated-status")).size() > 0;
        assertTrue(evaluatedExists);
        waitAndClick(".materials-progress-evaluated-status");
        waitForPresentAndVisible(".workspace-progress-element-menu-content.evaluable");
        assertPresent(".workspace-progress-element-menu-content.evaluable");
        
        waitForPresent(".materials-progress-practice-status");
        boolean practiceExists = getWebDriver().findElements(By.cssSelector(".materials-progress-practice-status")).size() > 0;
        assertTrue(practiceExists);
        waitAndClick(".materials-progress-practice-status");
        waitForPresentAndVisible(".workspace-progress-element-menu-content.exercise");
        assertPresent(".workspace-progress-element-menu-content.exercise");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial2.getId());
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspace(workspace.getId());        
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS
      }
    )
  public void courseProgressWidgetTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Long courseId = 2l;
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      login();
      Workspace workspace = createWorkspace("testcourses", "test course for testing", String.valueOf(courseId), Boolean.TRUE);

      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .build();

      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
        "EVALUATED");
      
      WorkspaceHtmlMaterial exerciseMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
          "EXERCISE");
      
      logout();
      try{
        mockBuilder.mockLogin(student);
        login();
        
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".materials-progress-evaluated-status");
        boolean evaluatedExists = getWebDriver().findElements(By.cssSelector(".materials-progress-evaluated-status")).size() > 0;
        assertTrue(evaluatedExists);

        waitForPresent(".materials-progress-practice-status");
        boolean practiceExists = getWebDriver().findElements(By.cssSelector(".materials-progress-practice-status")).size() > 0;
        assertTrue(practiceExists);
        
        assertVisible(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
        assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "");
        assertClassNotPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
        sendKeys(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
        waitClassPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
        waitAndClick(String.format("#page-%d .muikku-submit-assignment", htmlMaterial.getId()));
        waitForPresentAndVisible(".notification-queue-item-success");
        waitForElementToBeClickable(String.format("#page-%d .muikku-withdraw-assignment", htmlMaterial.getId()));

        waitForPresent(".materials-progress-evaluated-status");
        assertTextIgnoreCase(".materials-progress-evaluated-status span", "1/1");
        
        assertVisible(String.format("#page-%d .muikku-text-field", exerciseMaterial.getId()));
        assertValue(String.format("#page-%d .muikku-text-field", exerciseMaterial.getId()), "");
        assertClassNotPresent(String.format("#page-%d .muikku-text-field", exerciseMaterial.getId()), "muikku-field-saved");
        sendKeys(String.format("#page-%d .muikku-text-field", exerciseMaterial.getId()), "field value");
        waitClassPresent(String.format("#page-%d .muikku-text-field", exerciseMaterial.getId()), "muikku-field-saved");
        waitAndClick(String.format("#page-%d .muikku-assignment-button", exerciseMaterial.getId()));
        waitUntilAnimationIsDone(".materials-progress-practice-status .slice .bar");
        waitForPresent(".materials-progress-practice-status");
        waitUntilContentChanged(".materials-progress-practice-status span", "0/1");
        
        assertTextIgnoreCase(".materials-progress-practice-status span", "1/1");
        
        waitAndClick(".materials-progress-evaluated-status.evaluable span");
        waitForPresentAndVisible(".workspace-progress-element-menu-content.evaluable");
        assertTextIgnoreCase("#evaluableMenu>div>div:nth-child(2)>span:first-child", "Tehtäviä palautettu");
        assertTextIgnoreCase("#evaluableMenu>div>div:nth-child(2)>span:last-child", "1");

        assertTextIgnoreCase("#evaluableMenu>div>div:nth-child(3)>span:first-child", "Tehtäviä yhteensä");
        assertTextIgnoreCase("#evaluableMenu>div>div:nth-child(3)>span:last-child", "1");
        
        assertTextIgnoreCase("#evaluableMenu>div>div:nth-child(4)>span:first-child", "Tehtäviä arvioimatta");
        assertTextIgnoreCase("#evaluableMenu>div>div:nth-child(4)>span:last-child", "1");
        
        waitAndClick(".materials-progress-practice-status.exercise span");
        waitForPresentAndVisible(".workspace-progress-element-menu-content.exercise");
        assertTextIgnoreCase("#exerciseMenu>div>div:nth-child(2)>span:first-child", "Tehtäviä tehty");
        assertTextIgnoreCase("#exerciseMenu>div>div:nth-child(2)>span:last-child", "1");

        assertTextIgnoreCase("#exerciseMenu>div>div:nth-child(3)>span:first-child", "Tehtäviä yhteensä");
        assertTextIgnoreCase("#exerciseMenu>div>div:nth-child(3)>span:last-child", "1");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspaceHtmlMaterial(workspace.getId(), exerciseMaterial.getId());
        deleteWorkspace(workspace.getId());        
      }
    }finally{
      WireMock.reset();
    }
  }  

  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.SAFARI
      }
    )
  public void courseTeacherVacationInfoTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    long courseId = 1l;
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
    MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
    
    mockBuilder
    .addStudent(student)
    .addStaffMember(admin)
    .mockLogin(admin)
    .build();
    
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", Long.toString(courseId), Boolean.TRUE);
    
    mockBuilder
    .addCourseStaffMember(courseId, courseStaffMember)
    .addCourseStudent(courseId, courseStudent)
    .build();
    try{
      navigate("/profile", false);
      waitForPresent(".profile-element__item:nth-child(2) .react-datepicker-wrapper .react-datepicker__input-container input");
      sendKeys(".profile-element__item:nth-child(2) .react-datepicker-wrapper .react-datepicker__input-container input", "21.12.2010");
      waitAndClick(".profile-element__title");
      waitAndClick(".profile-element__title");
      waitForPresent(".profile-element__item:nth-child(3) .react-datepicker-wrapper .react-datepicker__input-container input");
      sendKeys(".profile-element__item:nth-child(3) .react-datepicker-wrapper .react-datepicker__input-container input", "21.12.2025");
      waitAndClick(".profile-element__title");
      waitAndClick(".profile-element__title");
      waitAndClick(".button--primary-function-save");
      logout();
      mockBuilder.mockLogin(student);
      login();
      selectFinnishLocale();
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForPresent(".workspace-teacher-info .vacation-period");
      assertTextIgnoreCase(".workspace-teacher-info .vacation-period", "Poissa 21.12.2010 - 21.12.2025");      
    }finally{
      WireMock.reset();
      deleteWorkspace(workspace.getId());  
    }
  }
}
