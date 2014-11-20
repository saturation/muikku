package fi.muikku.plugins.schooldatapyramus;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import fi.muikku.dao.PluginDAO;

public abstract class SchoolDataPyramusDAO<T> extends PluginDAO<T> {

  private static final long serialVersionUID = -400122309420762858L;

  protected EntityManager getEntityManager() {
    return entityManager;
  }

  @PersistenceContext(unitName = "muikku-school-data-pyramus")
  private EntityManager entityManager;
}
