package fi.muikku.plugins.bridgetest;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Subject;

@Named
@Stateful
@RequestScoped
public class CourseMetaBridgeTestController {

  @Inject 
  private CourseMetaController courseMetaController; 

  public List<Subject> listSubjects() {
    return courseMetaController.listSubjects();
  }

  public List<CourseIdentifier> listCourseIdentifiers() {
    return courseMetaController.listCourseIdentifiers();
  }
 
  public CourseIdentifier findCourseIdentifier(String identifier) {
    return courseMetaController.findCourseIdentifier(schoolDataSource, identifier);
  }
  
  public String getCourseIdentifier() {
    return courseIdentifier;
  }

  public void setCourseIdentifier(String courseIdentifier) {
    this.courseIdentifier = courseIdentifier;
  }

  public CourseIdentifier getCourseIdentifierValue() {
    if (courseIdentifier != null)
      return findCourseIdentifier(courseIdentifier);
    else
      return null;
  }
  
  public Subject getSubjectValue() {
    if (subjectIdentifier != null)
      return courseMetaController.findSubject(schoolDataSource, subjectIdentifier);
    else
      return null;
  }

  public String getSubjectIdentifier() {
    return subjectIdentifier;
  }

  public void setSubjectIdentifier(String subjectIdentifier) {
    this.subjectIdentifier = subjectIdentifier;
  }

  public boolean isListCourseIdentifiersValue() {
    return listCourseIdentifiersValue;
  }

  public void setListCourseIdentifiersValue(boolean listCourseIdentifiersValue) {
    this.listCourseIdentifiersValue = listCourseIdentifiersValue;
  }

  public boolean isListSubjectsValue() {
    return listSubjectsValue;
  }

  public void setListSubjectsValue(boolean listSubjectsValue) {
    this.listSubjectsValue = listSubjectsValue;
  }

  public void toggleListCourseIdentifiers() {
    listCourseIdentifiersValue = !listCourseIdentifiersValue;
  }
  
  public void toggleListSubjects() {
    listSubjectsValue = !listSubjectsValue;
  }
  
  private String schoolDataSource = "PYRAMUS";
  private String courseIdentifier;
  private String subjectIdentifier;
  private boolean listSubjectsValue = false;
  private boolean listCourseIdentifiersValue = false;
}
