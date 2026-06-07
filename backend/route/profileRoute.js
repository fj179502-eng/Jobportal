import express from "express";
const router=express.Router();
import { addProfile,getAllProfile,getProfile,updateProfile,deleteProfile } from "../controller/profileController.js";
import {verifyToken} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/multer.js";

router.post("/",verifyToken,allowRoles("admin"),upload.single("resume"),addProfile);
router.get("/",verifyToken,allowRoles("admin"),getAllProfile);
router.get("/:id",verifyToken,allowRoles("admin"),getProfile);
router.put("/:id",verifyToken,allowRoles("admin"),upload.single("resume"),updateProfile);
router.delete("/:id",verifyToken,allowRoles("admin"),deleteProfile);

export default router; 