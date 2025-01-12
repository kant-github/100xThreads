import { Router } from "express";
import { getAllOrganizations } from "../controllers/organization/getAllOrganizations";
import { getOrganizations } from "../controllers/organization/getOrganizations";
import { caseJoinOrganization } from "../controllers/organization/caseJoinOrganization";
import { storeOrganization } from "../controllers/organization/storeOrganization";
import { deleteOrganizations } from "../controllers/organization/deleteOrganizations";
import getOrganizationBySearch from "../controllers/organization/getOrganizationBysearch";
import alreadyUserMiddleware from "../middlewares/alreadyUserMiddleware copy";
import { getUserDetails } from "../controllers/userController/getUserDetails";
import { updateUserDetails } from "../controllers/userController/updateUserDetails";
import authmiddleware from "../middlewares/authMiddleware";
import joinOrganizationWithPassword from "../controllers/organization/joinOrganizationWithPassword";

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

export default router;
