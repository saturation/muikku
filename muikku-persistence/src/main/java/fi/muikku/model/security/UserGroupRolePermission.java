package fi.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.users.UserGroup;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class UserGroupRolePermission extends RolePermission {

  // TODO: Unique all?

  public UserGroup getUserGroup() {
    return userGroup;
  }

  public void setUserGroup(UserGroup userGroup) {
    this.userGroup = userGroup;
  }

  @ManyToOne
  private UserGroup userGroup;
}
