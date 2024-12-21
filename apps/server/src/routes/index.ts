import { Router } from "express";
import authmiddleware from "../middleware/authMiddleware";
import storeChatGroup from "../chatGroupController/storeChatGroup";
import getChatGroups from "../chatGroupController/getChatGroups";
import getChatGroupsById from "../chatGroupController/getChatGroupsById";
import updateChatGroupById from "../chatGroupController/updateChatGroupById";
import DeleteChatGroupById from "../chatGroupController/DeleteChatGroupById";
import { getChatGroupUsers } from "../chatGroupUsersController/getChatGroupUsers";
import { createChatGroupUser } from "../chatGroupUsersController/createChatGroupUser";
import { deleteChatGroupUser } from "../chatGroupUsersController/deleteChatGroupUserController";
import getChatGroupUserBySearch from "../chatGroupController/getChatGroupBySearch";
import getChats from "../chatController/getChats";
import { getUserDetails } from "../userController/getUserDetails";
import { getRecentJoinedChatGroup } from "../chatGroupController/getRecentJoinedChatGroup";
import { updateUserDetails } from "../userController/updateUserDetails";
import { getOrganizations } from "../organizationsController/getOrganizations";
import { storeOrganization } from "../organizationsController/storeOrganization";
import { deleteOrganizations } from "../organizationsController/deleteOrganizations";
import getOrganizationBySearch from "../organizationsController/getOrganizationBysearch";
import { getAllOrganizations } from "../organizationsController/getAllOrganizations";
const router = Router();

// user_controller
router.get("/user/:id", authmiddleware, getUserDetails);
router.put("/user", authmiddleware, updateUserDetails);



// organizations controller
router.get("/organizations", authmiddleware, getOrganizations);
router.post("/organizations", authmiddleware, storeOrganization);
router.delete("/organizations/:id", authmiddleware, deleteOrganizations);
router.get("/organizations-by-search", authmiddleware, getOrganizationBySearch);
router.get("/organiaztions-all", getAllOrganizations);


//chat-group-controller
router.get("/chat-group", authmiddleware, getChatGroups);
router.post("/chat-group", authmiddleware, storeChatGroup);
router.get("/chat-group-check/:id", authmiddleware, getChatGroupsById);
router.put("/chat-group/:id", authmiddleware, updateChatGroupById);
router.delete("/chat-group/:id", authmiddleware, DeleteChatGroupById);
router.get("/chat-group-by-search", getChatGroupUserBySearch);
router.get("/recent-chat-group-join", authmiddleware, getRecentJoinedChatGroup);

// chat-group-user-controller
router.get("/chat-group-user", getChatGroupUsers);
router.post("/chat-group-user", createChatGroupUser);
router.delete("/chat-group-user", deleteChatGroupUser);

// chats-controller
router.get("/chats/:group_id", getChats);

export default router;
