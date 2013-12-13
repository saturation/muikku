package fi.muikku.plugins.fish;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.controller.WidgetController;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetSpace;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.fish.dao.FishMessageDAO;
import fi.muikku.plugins.fish.model.FishMessage;

@ApplicationScoped
@Stateful
public class DatabaseFishPluginDescriptor implements PluginDescriptor,
                                                     PersistencePluginDescriptor,
                                                     LocalizedPluginDescriptor {
  @Inject
  private WidgetController widgetController;

  @Override
  public String getName() {
    return "databasefish";
  }

  @Override
  public void init() {
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
        
    /* DAOs */
        
    FishMessageDAO.class,
        
    /* Controllers */

    DatabaseFishWidgetController.class,

    /* Backing Beans */

    DatabaseFishWidgetBackingBean.class));
  }

  @Override
  public Class<?>[] getEntities() {
    return new Class<?>[] {
      FishMessage.class,
    };
  }
  
  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.fish.DatabaseFishPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.fish.DatabaseFishPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }

}
