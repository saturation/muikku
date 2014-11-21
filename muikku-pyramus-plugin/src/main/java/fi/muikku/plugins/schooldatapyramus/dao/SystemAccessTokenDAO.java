package fi.muikku.plugins.schooldatapyramus.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusDAO;
import fi.muikku.plugins.schooldatapyramus.model.SystemAccessToken;

public class SystemAccessTokenDAO extends SchoolDataPyramusDAO<SystemAccessToken> {

  private static final long serialVersionUID = 3093191898132041842L;

  public SystemAccessToken create(String accessToken, Long expires, String refreshToken, String authCode){
    SystemAccessToken systemAccessToken = new SystemAccessToken();
    systemAccessToken.setAccessToken(accessToken);
    systemAccessToken.setExpires(expires);
    systemAccessToken.setRefreshToken(refreshToken);
    systemAccessToken.setAuthCode(authCode);
    return persist(systemAccessToken);
  }
  
  public SystemAccessToken refresh(SystemAccessToken systemAccessToken, String accessToken, Long expires){
    systemAccessToken.setAccessToken(accessToken);
    systemAccessToken.setExpires(expires);
    return persist(systemAccessToken);
  }
  
  public SystemAccessToken getSystemAccessToken(){
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SystemAccessToken> criteria = criteriaBuilder.createQuery(SystemAccessToken.class);
    Root<SystemAccessToken> root = criteria.from(SystemAccessToken.class);
    criteria.select(root);
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
