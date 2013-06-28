package fi.muikku.plugins.settings;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class SettingsPluginDescriptor implements PluginDescriptor {

	private static final String DOCK_SETTINGS_WIDGET_LOCATION = fi.muikku.WidgetLocations.ENVIRONMENT_DOCK_TOP_CENTER;
	private static final int DOCK_SETTINGS_WIDGET_MINIMUM_SIZE = 1;
	private static final String DOCK_SETTINGS_WIDGET_NAME = "docksettings";
	
	private static final String USERS_WIDGET_LOCATION = WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT;
	private static final int USERS_WIDGET_MINIMUM_SIZE = 1;
	private static final String USERS_WIDGET_NAME = "settings-navigation-users";
	
	@Inject
	private WidgetController widgetController;
	
	@Override
	public String getName() {
		return "settings";
	}
	
	@Override
	public void init() {
		/**
		 * Dock widget
		 */
		
		widgetController.ensureDefaultWidget(widgetController.ensureWidget(DOCK_SETTINGS_WIDGET_NAME, DOCK_SETTINGS_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED), DOCK_SETTINGS_WIDGET_LOCATION);
		
		/**
		 * Settings navigation widgets
		 */
		
		widgetController.ensureDefaultWidget(widgetController.ensureWidget(USERS_WIDGET_NAME, USERS_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED), USERS_WIDGET_LOCATION);
	}

	@Override
	public List<Class<?>> getBeans() {
		return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
		  SettingsBackingBean.class 
		}));
	}

}
