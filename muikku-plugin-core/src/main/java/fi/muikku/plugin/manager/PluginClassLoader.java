package fi.muikku.plugin.manager;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.jar.JarInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.filefilter.FileFileFilter;
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
  
  // TODO: Useless?
  @Override
  protected Class<?> findClass(String name) throws ClassNotFoundException {
    if (INJECT_TO_PARENT) {
      try {
        ClassLoader parentClassLoader = getParent();
        Method method = ClassLoader.class.getDeclaredMethod("findClass", new Class[] { String.class });
        method.setAccessible(true);
        return (Class<?>) method.invoke(parentClassLoader, name);
      } catch (IllegalAccessException e) {
      } catch (IllegalArgumentException e) {
      } catch (InvocationTargetException e) {
      } catch (NoSuchMethodException e) {
      } catch (SecurityException e) {
      }
      
      throw new ClassNotFoundException();
    } else {
      return super.findClass(name);
    }
  }

  public void addFile(File packageFolder, File file) {
    if (INJECT_TO_PARENT) {
      readClassData(packageFolder, file);
    } 
    
    try {
      addURL(file.toURI().toURL());
    } catch (MalformedURLException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
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
    if (INJECT_TO_PARENT) {
      if (StringUtils.endsWith(url.toExternalForm(), ".jar")) {
        try {
          InputStream jarStream = url.openStream();
          try {
            JarInputStream jarInputStream = new JarInputStream(jarStream);
            try {
              JarEntry jarEntry;
              
              while ((jarEntry = jarInputStream.getNextJarEntry()) != null) {
                if (!jarEntry.isDirectory()) {
                  String fileName = jarEntry.getName();
                  if (StringUtils.endsWith(fileName, ".class")) {
                    String className = fileNameToClassName(fileName);
                    long size = jarEntry.getSize();
                    byte[] data = new byte[(int) size];
                    IOUtils.read(jarInputStream, data, 0, (int) size);
                    setClassData(className, data);
                  }
                }
              }
              
            } finally {
              jarInputStream.close();
            }
          } finally {
            jarStream.close();
          }
        } catch (IOException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }
      }
    }
    
    super.addURL(url);
  }

  private void setClassData(String className, byte[] data) {
    System.out.println("setting classdata for " + className);
    
    classData.put(className, data);
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
              setClassData(className, bytes);
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
    System.out.println("Injecting " + className);
    
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
