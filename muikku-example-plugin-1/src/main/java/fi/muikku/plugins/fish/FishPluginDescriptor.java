package fi.muikku.plugins.fish;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class FishPluginDescriptor implements PluginDescriptor {

  @Override
  public String getName() {
    return "fish";
  }

  @Override
  public void init() {
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
    /* Controllers */

    FishWidgetController.class,

    /* Backing Beans */

    FishWidgetBackingBean.class));
  }

}
