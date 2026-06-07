import express from "express";
const router=express.Router();
import { addApplication,getAllApplication,getApplication,updateApplication,deleteApplication } from "../controller/applicationController.js";
import {verifyToken} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/multer.js";

router.post("/", verifyToken, allowRoles("admin"), upload.single("cv"), addApplication);
router.get("/", verifyToken,allowRoles("admin"),getAllApplication);
router.get("/:id", verifyToken,allowRoles("admin"),getApplication);
router.put("/:id", verifyToken, allowRoles("admin"), upload.single("cv"), updateApplication);
router.delete("/:id", verifyToken,allowRoles("admin"),deleteApplication);

export default  router;