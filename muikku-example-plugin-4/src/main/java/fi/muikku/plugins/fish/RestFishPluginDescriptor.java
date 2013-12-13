package fi.muikku.plugins.fish;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetSpace;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugins.fish.rest.RestFishRestService;

@ApplicationScoped
@Stateful
public class RestFishPluginDescriptor implements PluginDescriptor, RESTPluginDescriptor {

  private static final String FISH_WIDGET_LOCATION = "environment.header.left";
  private static final String FISH_WIDGET_NAME = "restfish";
  private static final int FISH_WIDGET_MINIMUM_SIZE = 8;
  
  public static final int FISH_WIDGET_UPDATE_INTERVAL = 10000;

  @Inject
  private WidgetController widgetController;

  @Override
  public String getName() {
    return "restfish";
  }

  @Override
  public void init() {
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
    /* Controllers */

    RestFishController.class,

    /* Backing Beans */

    RestFishWidgetBackingBean.class));
  }

  @Override
  public Class<?>[] getRESTServices() {
    return new Class<?>[] {
        RestFishRestService.class
    };
  }

}
