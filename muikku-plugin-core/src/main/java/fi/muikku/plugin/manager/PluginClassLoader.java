package fi.muikku.plugin.manager;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.plexus.util.IOUtil;

public class PluginClassLoader extends URLClassLoader {

  private static final boolean INJECT_TO_PARENT = true;

  public PluginClassLoader(ClassLoader parentClassLoader) {
    super(new URL[] {}, parentClassLoader);
  }

  public void addJar(URL url) {
    addURL(url);
  }

  public void addFile(File packageFolder, File file) {
    if (INJECT_TO_PARENT) {
      readClassData(packageFolder, file);
    } else {
      try {
        addURL(file.toURI().toURL());
      } catch (MalformedURLException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
    }
  }
  
  public void injectClasses() {
    while (!classData.isEmpty()) {
      synchronized (this) {
        String className = classData.keySet().iterator().next();
        byte[] data = classData.get(className);
        classData.remove(className);
        injectClass(className, data);
      }
    }
  }

  @Override
  protected void addURL(URL url) {

    //
    // ClassLoader parentClassLoader = getParent();
    // Class<?> parentClassLoaderClass = parentClassLoader.getClass();
    //
    // try {
    // 
    // method.setAccessible(true);
    // method.invoke(parentClassLoaderClass, new Object[] { url });
    // } catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
    // // TODO Auto-generated catch block
    // e.printStackTrace();
    // } catch (NoSuchMethodException e) {
    // // TODO Auto-generated catch block
    // e.printStackTrace();
    // } catch (SecurityException e) {
    // // TODO Auto-generated catch block
    // e.printStackTrace();
    // }

    super.addURL(url);
  }

  private void readClassData(File packageFolder, File file) {
    if (file.isDirectory()) {
      for (File child : file.listFiles()) {
        readClassData(packageFolder, child);
      }
    } else {
      if (StringUtils.endsWith(file.getName(), ".class")) {
        String relativePath = packageFolder.toURI().relativize(file.toURI()).getPath();
        String className = fileNameToClassName(relativePath);
        try {
          if (!isClassDefined(className)) {
            FileInputStream inputStream = new FileInputStream(file);
            byte[] bytes = IOUtil.toByteArray(inputStream);
            synchronized (this) {
              classData.put(className, bytes);
            }
            // injectClass(className, bytes);
            inputStream.close();
          }
        } catch (FileNotFoundException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        } catch (IOException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }
      }
    }
  }
  
  private boolean isClassDefined(String className) {
    try {
      return getParent().loadClass(className) != null;
    } catch (ClassNotFoundException e) {
    }
    
    return false;
  }

  private void injectClass(String className, byte[] bytes) {
    try {
      ClassLoader parentClassLoader = getParent();
      Method method = ClassLoader.class.getDeclaredMethod("defineClass", new Class[] { String.class, byte[].class, int.class, int.class });
      method.setAccessible(true);
      method.invoke(parentClassLoader, className, bytes, 0, bytes.length);
    } catch (InvocationTargetException ite) {
      if (ite.getTargetException() instanceof NoClassDefFoundError) {
        String dependingClassName = fileNameToClassName(((NoClassDefFoundError) ite.getTargetException()).getMessage());
        if (classData.containsKey(dependingClassName)) {
          // Inject depending class 
          byte[] data = classData.get(dependingClassName);
          classData.remove(dependingClassName);
          injectClass(dependingClassName, data);
          // and try again
          injectClass(className, bytes);
        } else {
          System.out.println(dependingClassName + " could not be found");
        }
      }
    } catch (NoSuchMethodException e) {
    } catch (SecurityException e) {
    } catch (IllegalAccessException e) {
    } catch (IllegalArgumentException e) {
    }
  }
  
  private String fileNameToClassName(String fileName) {
    return StringUtils.replace(StringUtils.removeEnd(fileName, ".class"), "/", ".");
  }
  
  
//  private synchronized byte[] getClassData(String className) {
//    return classData.get(className);
//  }
//  
//  private synchronized void clearClassData(String className) {
//    classData.remove(className);
//  }
//  
//  private synchronized void setClassData(String className, byte[] data) {
//    classData.put(className, data);
//  }

  private Map<String, byte[]> classData = new HashMap<>();
}
