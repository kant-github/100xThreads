import { Router } from "express";
import { getAllOrganizations } from "../controllers/organization/getAllOrganizations";
import { getOrganizations } from "../controllers/organization/getOrganizations";
import { caseJoinOrganization } from "../controllers/organization/caseJoinOrganization";
import { storeOrganization } from "../controllers/organization/storeOrganization";
import { deleteOrganizations } from "../controllers/organization/deleteOrganizations";
import alreadyUserMiddleware from "../middlewares/alreadyUserMiddleware";
import { getUserDetails } from "../controllers/user/getUserDetails";
import { updateUserDetails } from "../controllers/user/updateUserDetails";
import authmiddleware from "../middlewares/authMiddleware";
import joinOrganizationWithPassword from "../controllers/organization/joinOrganizationWithPassword";
import getChats from "../controllers/chats/getChats";
import { getPoll } from "../controllers/polls/getPoll";
import { getWelcomeChannelMessages } from "../controllers/welcome-channel/getWelcomeChannelMessages";
import { getAnnouncementChannelMessages } from "../controllers/announcement-channel/getAnnouncementchannelMessages";
import { createAnnouncement } from "../controllers/announcement-channel/createAnnouncement";
import { createProjectHandler } from "../controllers/projects-channel/createProject";
import { getProjectChannelMessages } from "../controllers/projects-channel/getProjectChannelMessages";
import { getProjectchannelChats } from "../controllers/projects-channel/getProjectchannelChats";
import { getUserProfileData } from "../controllers/user/getUserProfileData";
import { getTaskForProject } from "../controllers/projects-channel/getTaskForProject";
import getNotifications from "../controllers/notifications/getNotifications";
import { getUserNameDetails } from "../controllers/user/getUserNameDetails";
import getOrganizationAndUserBySearch from "../controllers/organization/getOrganizationAndUserBySearch";
import getP2pChats from "../controllers/p2p/getP2pChats";
import caseJoinP2pChat from "../controllers/p2p/caseJoinP2pChat";
import getFriends from "../controllers/friends/getFriends";
import updateTagHandler from "../controllers/settings-channel/tags/updateTagHandler";
import deleteTagHandler from "../controllers/settings-channel/tags/deleteTagHandler";
import assignTagsHandler from "../controllers/organization-settings/assignTagsHandler";
import assignRolesHandler from "../controllers/organization-settings/assignRolesHandler";
import googleAuthController from "../controllers/user/googleAuthController";
import googleAuthCallbackController from "../controllers/user/googleAuthCallbackController";
import storeOrgLocation from "../controllers/organization-settings/storeOrgLocation";
import getOrgLocations from "../controllers/organization-settings/getOrgLocation";
import { updateOrgLocation } from "../controllers/organization-settings/updateOrgLoction";
import { deleteOrgLocation } from "../controllers/organization-settings/deleteOrgLocation";
import storeTagHandler from "../controllers/settings-channel/tags/StoreTagHandler";
import createGoogleCalendarEventController from "../controllers/events/createGoogleCalendarEventController";
import getEventsByChannel from "../controllers/events/getEventsByChannel";
import getEvent from "../controllers/events/getEvent";
import getMyEvents from "../controllers/events/getMyEvents";
import updateEvent from "../controllers/events/updateEvent";
import loginUserController from "../controllers/user/loginUserController";
import isValidOrganizationName from "../controllers/organization/isValidOrganizationName";
import connectChannelToGoogleCalendar from "../controllers/events/connectChannelToGoogleCalendar";
import deleteEvent from "../controllers/events/deleteEvent";
import getEventsForChannelByDate from "../controllers/events/getEventsForChannelByDate";

const router: Router = Router();

// user_controller
router.post("/auth/login", loginUserController);
router.get("/user/:id", authmiddleware, getUserDetails);
router.put("/user", authmiddleware, updateUserDetails);
router.get("/user/profile-data/:organizationId/:userId", authmiddleware, getUserProfileData);
router.get("/check-username", authmiddleware, getUserNameDetails);
router.get('/oauth/google', googleAuthController);
router.get('/oauth/google/callback', googleAuthCallbackController);


// organizations controller
router.get("/organizations", authmiddleware, getOrganizations);
router.post("/organizations/join-by-passcode/:organizationId", authmiddleware, joinOrganizationWithPassword);
router.get("/organizations/join/:organizationId", authmiddleware, alreadyUserMiddleware, caseJoinOrganization);
router.post("/organizations", authmiddleware, storeOrganization);
router.delete("/organizations/:organizationId", authmiddleware, deleteOrganizations);
router.get("/organizations-and-user-by-search", authmiddleware, getOrganizationAndUserBySearch);
router.get("/organizations-all", authmiddleware, getAllOrganizations);
router.get("/organizations-search", authmiddleware, isValidOrganizationName);

// organization-settings controller
router.post("/organizations/settings/users/assign-tags", authmiddleware, assignTagsHandler);
router.post("/organizations/settings/users/assign-roles", authmiddleware, assignRolesHandler);

// chats-controller
router.get("/organizations/:organizationId/channels/:channelId/chats", authmiddleware, getChats);

//welcome-channel-message-controller
router.get("/organizations/:organizationId/channels/:channelId/welcome-channel", authmiddleware, getWelcomeChannelMessages);

//announcement-channel-controller
router.get("/organizations/:organizationId/channels/:channelId/announcement-channel", authmiddleware, getAnnouncementChannelMessages);
router.post("/organizations/:organizationId/channels/:channelId/announcement-channel", authmiddleware, createAnnouncement);

//project-channel-controller
router.get("/organizations/:organizationId/channels/:channelId/project-channel", authmiddleware, getProjectChannelMessages);
router.post("/organizations/:organizationId/channels/:channelId/project-channel", authmiddleware, createProjectHandler);
router.get("/organizations/:organizationId/channels/:channelId/project/:projectId/chats", authmiddleware, getProjectchannelChats);
router.get("/organizations/:organizationId/channels/:channelId/project/:projectId", authmiddleware, getTaskForProject);

//polls-controller
router.get("/polls/:id/:channelId", authmiddleware, getPoll);


//notification-controller
router.get("/notifications", authmiddleware, getNotifications);

//p2p-controller
router.get("/p2p/case-join", authmiddleware, caseJoinP2pChat);
router.get("/p2p/:username", authmiddleware, getP2pChats);

//friends-controller
router.get("/friends", authmiddleware, getFriends);

//organization-tags-controller
router.post("/organization/tags/:organizationId", authmiddleware, storeTagHandler);
router.get("/organization/tags/:organizationId", authmiddleware, storeTagHandler);
router.put("/organization/tags/:organizationId/:tagId", authmiddleware, updateTagHandler);
router.delete("/organization/tags/:organizationId/:tagId", authmiddleware, deleteTagHandler);

//organization-location-controller
router.post("/organizations/settings/location/:organizationId", authmiddleware, storeOrgLocation);
router.get("/organizations/settings/location/:organizationId", authmiddleware, getOrgLocations);
router.put("/organizations/settings/location/:organizationId/:tagId", authmiddleware, updateOrgLocation);
router.delete("/organizations/settings/location/:organizationId/:id", authmiddleware, deleteOrgLocation);


//event-controller
router.post("/organizations/event/:organizationId", authmiddleware, createGoogleCalendarEventController);
router.put("/organizations/event/:organizationId/:eventId", authmiddleware, updateEvent);
router.delete("/organizations/event/:organizationId/:eventId", authmiddleware, deleteEvent);
router.get("/organizations/event/:eventChannelId/connect-google-calendar", authmiddleware, connectChannelToGoogleCalendar);
router.get("/organizations/event/get-channel-events-by-date/:organizationId/:eventChannelId/:date", authmiddleware, getEventsForChannelByDate);
router.get("/organizations/event/:eventChannelId/:organizationId", authmiddleware, getEventsByChannel);
router.get("/event/:eventId", authmiddleware, getEvent);
router.get("/my-events", authmiddleware, getMyEvents);



export default router;
