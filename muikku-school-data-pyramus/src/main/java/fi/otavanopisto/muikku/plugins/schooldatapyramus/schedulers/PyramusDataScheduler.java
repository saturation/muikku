package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;

public abstract class PyramusDataScheduler {

//  @Inject
//  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private OffsetUpdaterThing thing;
  
  public abstract String getSchedulerName();

  protected int getOffset() {
    return thing.getOffset(getSchedulerName());
//    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data-pyramus", "pyramus-updater." + getSchedulerName() + ".offset"));
  }
  
  protected void updateOffset(int newOffset) {
    thing.updateOffset(getSchedulerName(), newOffset);
//    pluginSettingsController.setPluginSetting("school-data-pyramus", "pyramus-updater." + getSchedulerName() + ".offset", String.valueOf(newOffset));
  }
  
}
