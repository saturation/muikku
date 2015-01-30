package fi.muikkku.ui;

import static org.junit.Assert.assertEquals;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import fi.muikku.AbstractIntegrationTest;

public class AbstractUITest extends AbstractIntegrationTest {

  protected void setWebDriver(RemoteWebDriver webDriver) {
    this.webDriver = webDriver;
  }

  protected RemoteWebDriver getWebDriver() {
    return webDriver;
  }

  protected void testTitle(String path, String expected) {
    getWebDriver().get(getAppUrl(true) + path);
    assertEquals(expected, getWebDriver().getTitle());
  }

  protected void testPageElementsByName(String elementName) {
    Boolean elementExists = getWebDriver().findElements(By.name(elementName)).size() > 0;
    assertEquals(true, elementExists);
  }

  protected void testLogin(String username, String password) throws InterruptedException {

  }

  protected void login(String username, String password) {

  }

  protected void waitForElementToBeClickable(By locator) {
    new WebDriverWait(getWebDriver(), 60).until(ExpectedConditions.elementToBeClickable(locator));
  }

  protected void waitForElementToBePresent(By locator) {
    new WebDriverWait(getWebDriver(), 60).until(ExpectedConditions.presenceOfElementLocated(locator));
  }
  
  protected void waitForUrlNotMatches(final String regex) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, 60).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        return !driver.getCurrentUrl().matches(regex);
      }
    });
  }

  protected void waitForUrl(final String url) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, 60).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        return url.equals(driver.getCurrentUrl());
      }
    });
  }

  protected void waitForUrlMatches(final String regex) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, 60).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        return driver.getCurrentUrl().matches(regex);
      }
    });
  }

  protected void sleep(long millis) {
    try {
      Thread.sleep(millis);
    } catch (InterruptedException e) {
    }
  }

  private RemoteWebDriver webDriver;

}