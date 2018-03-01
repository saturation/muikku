package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;

@Stateless
public class OffsetUpdaterThing {

  @Inject
  private PluginSettingsController pluginSettingsController;
 
  public int getOffset(String schedulerName) {
    int val = NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data-pyramus", "pyramus-updater." + schedulerName + ".offset"));
    System.out.println(String.format("Offset %d for %s", val, schedulerName));
    return val;
  }

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void updateOffset(String schedulerName, int newOffset) {
    System.out.println(String.format("Saving offset %d for %s", newOffset, schedulerName));
    pluginSettingsController.setPluginSetting("school-data-pyramus", "pyramus-updater." + schedulerName + ".offset", String.valueOf(newOffset));
  }

}
