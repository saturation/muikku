package fi.muikku.plugins.assessmentrequest.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestPermissions;
import fi.muikku.plugins.assessmentrequest.rest.model.AssessmentRequestRESTModel;
import fi.muikku.plugins.communicator.CommunicatorAssessmentRequestController;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/assessmentrequest")
@Produces("application/json")
@Stateful
public class AssessmentRequestRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1L;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private AssessmentRequestController assessmentRequestController;

  @LocalSession
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private CommunicatorAssessmentRequestController communicatorAssessmentRequestController;

  @POST
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentRequests")
  @RESTPermitUnimplemented
  public Response createAssessmentRequest(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, AssessmentRequestRESTModel newAssessmentRequest) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);

    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
    try {
      WorkspaceAssessmentRequest assessmentRequest = assessmentRequestController.createWorkspaceAssessmentRequest(workspaceUserEntity, newAssessmentRequest.getRequestText());
      communicatorAssessmentRequestController.sendAssessmentRequestMessage(assessmentRequest);
      return Response.ok(restModel(assessmentRequest)).build();
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Couldn't create workspace assessment request.", e);
      
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    } 
  }

  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/request")
  @RESTPermit(handling = Handling.INLINE)
  public Response findCurrentRequest(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
    
    List<WorkspaceAssessmentRequest> assessmentRequests = assessmentRequestController.listByWorkspaceUser(workspaceUserEntity);
    
    if (!assessmentRequests.isEmpty())
      return Response.ok(restModel(assessmentRequests.get(0))).build();
    else
      return Response.noContent().build();
  }
  
  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentRequests")
  @RESTPermit(handling = Handling.INLINE)
  public Response listAssessmentRequestsByWorkspaceId(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);

    if (!sessionController.hasPermission(AssessmentRequestPermissions.LIST_WORKSPACE_ASSESSMENTREQUESTS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    try {
      List<WorkspaceAssessmentRequest> assessmentRequests = assessmentRequestController.listByWorkspace(workspaceEntity); 
  
      return Response.ok(restModel(assessmentRequests)).build();
    } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
      logger.log(Level.SEVERE, "Couldn't list workspace assessment requests.", e);
      
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
  }
  
  @GET
  @Path("/assessmentrequestsforme")
  @RESTPermitUnimplemented
  public Response listAssessmentRequestsForMe(
      @QueryParam("workspaceId") Long workspaceEntityId,
      @QueryParam("userId") Long userEntityId,
      @QueryParam("state") String state
  ) {
    try {
      UserEntity userEntity = sessionController.getLoggedUserEntity();
    
//    List<AssessmentRequest> assessmentRequests = new ArrayList<AssessmentRequest>(assessmentRequestController.listByUser(userEntity));
//    ListIterator<AssessmentRequest> iterator = assessmentRequests.listIterator();
//    
//    while (iterator.hasNext()) {
//      AssessmentRequest assessmentRequest = iterator.next();
//      
//      if ((workspaceEntityId != null && !workspaceEntityId.equals(assessmentRequest.getWorkspace()))
//          || (userEntityId != null && !userEntityId.equals(assessmentRequest.getStudent()))
//          || (state != null && !state.equals(assessmentRequest.getState().name()))) {
//        iterator.remove();
//        continue;
//      }
//    }

      // TODO: pura osiin
      
      List<WorkspaceEntity> teacherWorkspaces = workspaceEntityController.listWorkspaceEntitiesByWorkspaceUser(userEntity);
      List<WorkspaceAssessmentRequest> assessmentRequests = new ArrayList<>();

      for (WorkspaceEntity workspaceEntity : teacherWorkspaces) {
        if (sessionController.hasPermission(AssessmentRequestPermissions.LIST_WORKSPACE_ASSESSMENTREQUESTS, workspaceEntity)) {
          assessmentRequests.addAll(assessmentRequestController.listByWorkspace(workspaceEntity));
        }
      }
      
      return Response.ok(restModel(assessmentRequests)).build();
    } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
      logger.log(Level.SEVERE, "Couldn't list workspace assessment requests.", e);
      
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
  }

  @DELETE
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentRequests/{ID}")
  @RESTPermitUnimplemented
  public Response deleteAssessmentRequest(
      @PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
      @PathParam("ID") String assessmentRequestId) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());    
    assessmentRequestController.deleteWorkspaceAssessmentRequest(workspaceUserEntity, assessmentRequestId);
    
    communicatorAssessmentRequestController.sendAssessmentRequestCancelledMessage(workspaceUserEntity);
    
    return Response.noContent().build();
  }

  private List<AssessmentRequestRESTModel> restModel(List<WorkspaceAssessmentRequest> workspaceAssessmentRequests) {
    List<AssessmentRequestRESTModel> restAssessmentRequests = new ArrayList<>();

    for (WorkspaceAssessmentRequest workspaceAssessmentRequest : workspaceAssessmentRequests) {
      AssessmentRequestRESTModel restModel = restModel(workspaceAssessmentRequest);
      if (restModel != null) {
        restAssessmentRequests.add(restModel);
      }
    }
    
    return restAssessmentRequests;
  }
  
  private AssessmentRequestRESTModel restModel(WorkspaceAssessmentRequest workspaceAssessmentRequest) {

    SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(
        workspaceAssessmentRequest.getWorkspaceUserIdentifier(),
        workspaceAssessmentRequest.getWorkspaceUserSchoolDataSource());
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
    if (workspaceUserEntity == null) {
      logger.log(Level.SEVERE, String.format("Could not find WorkspaceUserEntity for workspace assessment requets %s", workspaceAssessmentRequest.getIdentifier()));
      return null;
    }
    
    AssessmentRequestRESTModel restAssessmentRequest = new AssessmentRequestRESTModel(
        workspaceAssessmentRequest.getIdentifier(), 
        workspaceUserEntity.getWorkspaceEntity().getId(), 
        workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId(), 
        workspaceAssessmentRequest.getRequestText(), 
        workspaceAssessmentRequest.getDate());

    return restAssessmentRequest;
  }
}
