package fi.muikku.ui.sauce;

import java.net.MalformedURLException;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.junit.SauceOnDemandTestWatcher;

import fi.muikku.ui.base.CourseMaterialsPageTestsBase;

@RunWith (Parameterized.class)
public class CourseMaterialsPageTestsIT extends CourseMaterialsPageTestsBase {
  
  public SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication(getSauceUsername(), getSauceAccessKey());

  @Rule
  public SauceOnDemandTestWatcher resultReportingTestWatcher = new SauceOnDemandTestWatcher(this, authentication);
  
  @Parameterized.Parameters
  public static List<String[]> browsers() throws Exception {
    return getAllSauceBrowsers();
  }

  public CourseMaterialsPageTestsIT(String browser, String version, String platform, String resolution) {
    this.browser = browser;
    this.version = version;
    this.platform = platform;
    this.resolution = resolution;
  }
  
  @Before
  public void setUp() throws MalformedURLException {
    setWebDriver(createSauceWebDriver(browser, version, platform, resolution));
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
  @Override
  public void answerFileFieldTestStudent() throws Exception {
    if ("microsoftedge".equals(browser)) {
      // FIXME: this test does not work on edge because edge driver does not support file uploads
      return;
    }
    
    if ("safari".equals(browser)) {
      // FIXME: this test does not work on safari because safari driver does not support file uploads
      return;
    }
    
    super.answerFileFieldTestStudent();
  }
  
  @Override
  public void answerFileFieldTestAdmin() throws Exception {
    if ("microsoftedge".equals(browser)) {
      // FIXME: this test does not work on edge because edge driver does not support file uploads
      return;
    }
    
    if ("safari".equals(browser)) {
      // FIXME: this test does not work on safari because safari driver does not support file uploads
      return;
    }
    
    super.answerFileFieldTestAdmin();
  }
  
  @Override
  public void courseTOCExistsTest() throws Exception {
    if (!"microsoftedge".equals(browser)) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.courseTOCExistsTest();
    }
  }
  
  @Override
  public void courseMaterialTOCHighlightTest() throws Exception {
    if (!"microsoftedge".equals(browser)) {
      // FIXME: this test does not work because ms edge does not support window maximization yet
      super.courseMaterialTOCHighlightTest();
    }
  }
  
  private String platform;
  private String browser;
  private String version;  
  private String resolution;
}
