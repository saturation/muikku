package fi.muikku.plugins;

import java.io.IOException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.application.Resource;
import javax.faces.application.ResourceHandler;
import javax.faces.application.ResourceHandlerWrapper;
import javax.faces.application.ViewResource;
import javax.faces.context.FacesContext;

import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;

public class PluginResourceHandler extends ResourceHandlerWrapper {

  private static final String PLUGIN_RESOURCE_BASE_PATH = "META-INF/resources";
	private Logger logger = Logger.getLogger(PluginResourceHandler.class.getName());
		
	public PluginResourceHandler(ResourceHandler resourceHandler) {
		this.resourceHandler = resourceHandler;
	}

	@Override
	public ResourceHandler getWrapped() {
		return resourceHandler;
	}
	
	@Override
	public void handleResourceRequest(FacesContext context) throws IOException {
		ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
		try {
  		Thread.currentThread().setContextClassLoader(SingletonPluginManager.getInstance().getPluginsClassLoader());
  		super.handleResourceRequest(context);
		} catch (PluginManagerException e) {
			logger.log(Level.SEVERE, "Plugin resource handling failed", e);
		} finally {
		  Thread.currentThread().setContextClassLoader(contextClassLoader);
		}
	}
	
	@Override
	public Resource createResource(String resourceName) {
		return createResource(resourceName, null);
	}
	
	@Override
	public Resource createResource(String resourceName, String libraryName) {
		return createResource(resourceName, libraryName, null);
	}
	
	@Override
	public Resource createResource(String resourceName, String libraryName, String contentType) {
		ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
		try {
  		Thread.currentThread().setContextClassLoader(SingletonPluginManager.getInstance().getPluginsClassLoader());
  		return super.createResource(resourceName, libraryName, contentType);
		} catch (PluginManagerException e) {
			logger.log(Level.SEVERE, "Plugin resource creation failed", e);
			return null;
		} finally {
		  Thread.currentThread().setContextClassLoader(contextClassLoader);
		}
	}
	
	@Override
	public ViewResource createViewResource(FacesContext context, String resourceName) {
	  final URL resource;

    SingletonPluginManager pluginManager;
    try {
      pluginManager = SingletonPluginManager.getInstance();

      ClassLoader pluginsClassLoader = pluginManager.getPluginsClassLoader();

      StringBuilder pluginResourcePath = new StringBuilder().append(PLUGIN_RESOURCE_BASE_PATH).append(resourceName);

      resource = pluginsClassLoader.getResource(pluginResourcePath.toString());
      if (resource != null) {
        return new ViewResource() {
          @Override
          public URL getURL() {
            return resource;
          }
        };
      }
    } catch (PluginManagerException e) {
      logger.log(Level.SEVERE, "Plugin resource resolving failed", e);
    }

    return super.createViewResource(context, resourceName);
	}
	
	private final ResourceHandler resourceHandler;
}
