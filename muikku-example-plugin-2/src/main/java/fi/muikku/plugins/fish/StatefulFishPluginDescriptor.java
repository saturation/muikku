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

@ApplicationScoped
@Stateful
public class StatefulFishPluginDescriptor implements PluginDescriptor {
  @Override
  public String getName() {
    return "statefulfish";
  }

  @Override
  public void init() {
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
    /* Controllers */

    StatefulFishWidgetController.class,

    /* Backing Beans */

    StatefulFishWidgetBackingBean.class));
  }

}
