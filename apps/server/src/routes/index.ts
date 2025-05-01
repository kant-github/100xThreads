import { Router } from "express";
import { getAllOrganizations } from "../controllers/organization/getAllOrganizations";
import { getOrganizations } from "../controllers/organization/getOrganizations";
import { caseJoinOrganization } from "../controllers/organization/caseJoinOrganization";
import { storeOrganization } from "../controllers/organization/storeOrganization";
import { deleteOrganizations } from "../controllers/organization/deleteOrganizations";
import getOrganizationBySearch from "../controllers/organization/getOrganizationBysearch";
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

const router: Router = Router();

// user_controller
router.get("/user/:id", authmiddleware, getUserDetails);
router.put("/user", authmiddleware, updateUserDetails);
router.get("/user/profile-data/:organizationId/:userId", authmiddleware, getUserProfileData);


// organizations controller
router.get("/organizations", authmiddleware, getOrganizations);
router.post("/organizations/join-by-passcode/:organizationId", authmiddleware, joinOrganizationWithPassword);
router.get("/organizations/join/:organizationId", authmiddleware, alreadyUserMiddleware, caseJoinOrganization);
router.post("/organizations", authmiddleware, storeOrganization);
router.delete("/organizations/:organizationId", authmiddleware, deleteOrganizations);
router.get("/organizations-by-search", authmiddleware, getOrganizationBySearch);
router.get("/organizations-all", authmiddleware, getAllOrganizations);

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


export default router;
