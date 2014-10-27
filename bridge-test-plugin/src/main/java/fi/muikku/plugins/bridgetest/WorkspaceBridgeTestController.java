package fi.muikku.plugins.bridgetest;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Named
@Stateful
@RequestScoped
public class WorkspaceBridgeTestController {

  @Inject 
  private WorkspaceController workspaceController;

  @Inject
  private CourseMetaController courseMetaController;
  
  public List<Workspace> listWorkspaces() throws UnexpectedSchoolDataBridgeException {
    return workspaceController.listWorkspaces();
  }

  public List<WorkspaceType> listWorkspaceTypes() throws UnexpectedSchoolDataBridgeException {
    return workspaceController.listWorkspaceTypes();
  }

  public List<WorkspaceUser> getListWorkspaceUsers() throws UnexpectedSchoolDataBridgeException {
    if (listWorkspaceUsersValue != null) {
      Workspace x = workspaceController.findWorkspace(schoolDataSource, listWorkspaceUsersValue);
      return workspaceController.listWorkspaceUsers(x);
    } else
      return null;
  }

  public void toggleListWorkspaces() {
    listWorkspacesValue = !listWorkspacesValue;
  }

  public boolean isListWorkspacesValue() {
    return listWorkspacesValue;
  }

  public void setListWorkspacesValue(boolean listWorkspacesValue) {
    this.listWorkspacesValue = listWorkspacesValue;
  }

  public void toggleListWorkspaceTypes() {
    listWorkspaceTypesValue = !listWorkspaceTypesValue;
  }

  public boolean isListWorkspaceTypesValue() {
    return listWorkspaceTypesValue;
  }

  public void setListWorkspaceTypesValue(boolean listWorkspaceTypesValue) {
    this.listWorkspaceTypesValue = listWorkspaceTypesValue;
  }

  public Workspace getFindWorkspace() {
    if (findWorkspaceValue != null)
      return workspaceController.findWorkspace(schoolDataSource, findWorkspaceValue);
    else
      return null;
  }
  
  public String getFindWorkspaceValue() {
    return findWorkspaceValue;
  }

  public void setFindWorkspaceValue(String findWorkspaceValue) {
    this.findWorkspaceValue = findWorkspaceValue;
  }

  public String getListWorkspacesByCourseIdentifierValue() {
    return listWorkspacesByCourseIdentifierValue;
  }

  public void setListWorkspacesByCourseIdentifierValue(String listWorkspacesByCourseIdentifierValue) {
    this.listWorkspacesByCourseIdentifierValue = listWorkspacesByCourseIdentifierValue;
  }

  public List<Workspace> getListWorkspacesByCourseIdentifier() {
    if (listWorkspacesByCourseIdentifierValue != null) {
      CourseIdentifier x = courseMetaController.findCourseIdentifier(schoolDataSource, listWorkspacesByCourseIdentifierValue);
      return workspaceController.listWorkspacesByCourseIdentifier(x);
    } else
      return null;
  }
  
  public String getFindWorkspaceTypeValue() {
    return findWorkspaceTypeValue;
  }

  public void setFindWorkspaceTypeValue(String findWorkspaceTypeValue) {
    this.findWorkspaceTypeValue = findWorkspaceTypeValue;
  }

  public WorkspaceType getFindWorkspaceType() {
    if (findWorkspaceTypeValue != null)
      return workspaceController.findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, findWorkspaceTypeValue);
    else
      return null;
  }
  
  public String getFindWorkspaceUserValue() {
    return findWorkspaceUserValue;
  }

  public void setFindWorkspaceUserValue(String findWorkspaceUserValue) {
    this.findWorkspaceUserValue = findWorkspaceUserValue;
  }

  public WorkspaceUser getFindWorkspaceUser() {
//    if (findWorkspaceUserValue != null)
//      return workspaceController.findWorkspaceUser(schoolDataSource, findWorkspaceUserValue);
//    else
      return null;
  }
  
  public String getListWorkspaceUsersValue() {
    return listWorkspaceUsersValue;
  }

  public void setListWorkspaceUsersValue(String listWorkspaceUsersValue) {
    this.listWorkspaceUsersValue = listWorkspaceUsersValue;
  }

  public String getRemoveWorkspaceValue() {
    return removeWorkspaceValue;
  }

  public void setRemoveWorkspaceValue(String removeWorkspaceValue) {
    this.removeWorkspaceValue = removeWorkspaceValue;
  }

  public void removeWorkspace() {
    Workspace workspace = workspaceController.findWorkspace(schoolDataSource, removeWorkspaceValue);
    workspaceController.deleteWorkspace(workspace);
  }
  
  public CreateWorkspaceStub getCreateWorkspaceValue() {
    return createWorkspaceValue;
  }

  public void setCreateWorkspaceValue(CreateWorkspaceStub createWorkspaceValue) {
    this.createWorkspaceValue = createWorkspaceValue;
  }
  
  public Workspace createWorkspace() {
    WorkspaceType type = workspaceController.findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, createWorkspaceValue.getType());
    return workspaceController.createWorkspace(schoolDataSource, createWorkspaceValue.getName(), 
        createWorkspaceValue.getDescription(), type, createWorkspaceValue.getCourseIdentifierIdentifier());
  }

  private boolean listWorkspaceTypesValue = false;
  private boolean listWorkspacesValue = false;
  private String findWorkspaceValue;
  private String listWorkspacesByCourseIdentifierValue;
  private String findWorkspaceTypeValue;
  private String findWorkspaceUserValue;
  private String listWorkspaceUsersValue;
  private String removeWorkspaceValue;
  private String schoolDataSource = "PYRAMUS"; 
  private CreateWorkspaceStub createWorkspaceValue = new CreateWorkspaceStub();
  
  public class CreateWorkspaceStub {
    private String name;
    private String description; 
    private String type;
    private String courseIdentifierIdentifier;
    public String getCourseIdentifierIdentifier() {
      return courseIdentifierIdentifier;
    }
    public void setCourseIdentifierIdentifier(String courseIdentifierIdentifier) {
      this.courseIdentifierIdentifier = courseIdentifierIdentifier;
    }
    public String getType() {
      return type;
    }
    public void setType(String type) {
      this.type = type;
    }
    public String getDescription() {
      return description;
    }
    public void setDescription(String description) {
      this.description = description;
    }
    public String getName() {
      return name;
    }
    public void setName(String name) {
      this.name = name;
    }
    
  }
}
