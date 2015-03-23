package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

import fi.muikku.plugins.workspace.ContentNode;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;

public class ContentNode {

  public ContentNode(String title, String type, Long workspaceMaterialId, Long materialId, int level, 
      WorkspaceMaterialAssignmentType assignmentType, Long parentId, Boolean hidden, String html,
      Long currentRevision, Long publishedRevision) {
    super();
    this.children = new ArrayList<>();
    this.title = title;
    this.type = type;
    this.workspaceMaterialId = workspaceMaterialId;
    this.materialId = materialId;
    this.level = level;
    this.assignmentType = assignmentType;
    this.parentId = parentId;
    this.hidden = hidden;
    this.html = html;
    this.currentRevision = currentRevision;
    this.publishedRevision = publishedRevision;
  }

  public void addChild(ContentNode child) {
    this.children.add(child);
  }

  public String getTitle() {
    return title;
  }

  public String getType() {
    return type;
  }

  public List<ContentNode> getChildren() {
    return children;
  }

  public Long getMaterialId() {
    return materialId;
  }

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }
  
  public WorkspaceMaterialAssignmentType getAssignmentType() {
    return assignmentType;
  }
  
  public void setAssignmentType(WorkspaceMaterialAssignmentType assignmentType) {
    this.assignmentType = assignmentType;
  }
  
  public Boolean getHidden() {
    return hidden;
  }
  
  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }
  
  public Long getParentId() {
    return parentId;
  }
  
  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }
  
  public String getHtml() {
    return html;
  }
  
  public void setHtml(String html) {
    this.html = html;
  }

  public Long getCurrentRevision() {
    return currentRevision;
  }

  public void setCurrentRevision(Long currentRevision) {
    this.currentRevision = currentRevision;
  }

  public Long getPublishedRevision() {
    return publishedRevision;
  }

  public void setPublishedRevision(Long publishedRevision) {
    this.publishedRevision = publishedRevision;
  }

  private String title;
  private String type;
  private List<ContentNode> children;
  private Long workspaceMaterialId;
  private Long materialId;
  private int level;
  private WorkspaceMaterialAssignmentType assignmentType;
  private Boolean hidden;
  private Long parentId;
  private String html;
  private Long currentRevision;
  private Long publishedRevision;

}