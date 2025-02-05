import { Router } from "express";
import { getAllOrganizations } from "../controllers/organization/getAllOrganizations";
import { getOrganizations } from "../controllers/organization/getOrganizations";
import { caseJoinOrganization } from "../controllers/organization/caseJoinOrganization";
import { storeOrganization } from "../controllers/organization/storeOrganization";
import { deleteOrganizations } from "../controllers/organization/deleteOrganizations";
import getOrganizationBySearch from "../controllers/organization/getOrganizationBysearch";
import alreadyUserMiddleware from "../middlewares/alreadyUserMiddleware copy";
import { getUserDetails } from "../controllers/user/getUserDetails";
import { updateUserDetails } from "../controllers/user/updateUserDetails";
import authmiddleware from "../middlewares/authMiddleware";
import joinOrganizationWithPassword from "../controllers/organization/joinOrganizationWithPassword";
import getChats from "../controllers/chats/getChats";
import { getPoll } from "../controllers/polls/getPoll";
import { getWelcomeChannelMessages } from "../controllers/welcome-channel/getWelcomeChannelMessages";
import { getAnnouncementChannelMessages } from "../controllers/announcement-channel/getAnnouncementchannelMessages";
import { createAnnouncement } from "../controllers/announcement-channel/createAnnouncement";

const router = Router();

// user_controller
router.get("/user/:id", authmiddleware, getUserDetails);
router.put("/user", authmiddleware, updateUserDetails);


// organizations controller
router.get("/organizations", authmiddleware, getOrganizations);
router.post("/organizations/join-by-passcode/:id", authmiddleware, joinOrganizationWithPassword);
router.get("/organizations/join/:id", authmiddleware, alreadyUserMiddleware, caseJoinOrganization);
router.post("/organizations", authmiddleware, storeOrganization);
router.delete("/organizations/:id", authmiddleware, deleteOrganizations);
router.get("/organizations-by-search", authmiddleware, getOrganizationBySearch);
router.get("/organizations-all", authmiddleware, getAllOrganizations);

// chats-controller
router.get("/organizations/:organizationId/channels/:channelId/chats", authmiddleware, getChats);

//welcome-channel-message-controller
router.get("/organizations/:organizationId/channels/:channelId/welcome-channel", authmiddleware, getWelcomeChannelMessages);

//announcement-channel-controller
router.get("/organizations/:organizationId/channels/:channelId/announcement-channel", authmiddleware, getAnnouncementChannelMessages);
router.post("/organizations/:organizationId/channels/:channelId", authmiddleware, createAnnouncement);

//polls-controller
router.get("/polls/:id/:channelId", authmiddleware, getPoll);


export default router;
