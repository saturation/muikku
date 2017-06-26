package fi.otavanopisto.muikku.plugins.frontpage;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import javax.transaction.Transactional;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;
import org.ocpsoft.rewrite.faces.annotation.Deferred;

import fi.otavanopisto.muikku.auth.AuthSourceController;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@RequestScoped
@Join(path = "/", to = "/index.jsf")
public class FrontPageBackingBean {
  
  @Inject
  PluginSettingsController pluginSettingsController;
  
  @Inject
  private Logger logger;
  
  @Inject
  private AuthSourceController authSourceController;
  
  @Inject
  SessionController sessionController;
  
  @RequestAction
  @Transactional
  @Deferred
  public String init() {
    String brandedFrontPageKeyValue = pluginSettingsController.getPluginSetting("frontPage", "brandedFrontPage");
    String autoLogin = pluginSettingsController.getPluginSetting("frontPage", "autoLogin");
    
    if ("yes".equals(autoLogin) && !sessionController.isLoggedIn()) {
      FacesContext facesContext = FacesContext.getCurrentInstance();
      ExternalContext externalContext = facesContext.getExternalContext();
      
      try {
        List<AuthSource> credentialessAuthSources = authSourceController.listCredentialessAuthSources();
        externalContext.redirect("/login?authSource=" + 
            URLEncoder.encode(credentialessAuthSources.get(0).toString(), java.nio.charset.StandardCharsets.UTF_8.toString()));
      } catch (IOException e){
        logger.log(Level.SEVERE, "Login failed because of an internal error", e);
        return NavigationRules.INTERNAL_ERROR;
      }
    }
    
    if ("no".equals(brandedFrontPageKeyValue)) {
      brandedFrontPage = false;
      return "/index_nonbranded.jsf";
    } else {
      brandedFrontPage = true;
      return null;
    }
  }

  public boolean isBrandedFrontPage() {
    return brandedFrontPage;
  }
  
  private boolean brandedFrontPage;
}
