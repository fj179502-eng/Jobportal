import express from "express";
const router=express.Router();
import { addSaveJob,getAllSaveJob,getSaveJob,updateSaveJob,deleteSaveJob
} from "../controller/saveJobController.js";
import {verifyToken} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";

router.post("/", verifyToken, allowRoles("admin"), addSaveJob);
router.get("/",verifyToken,allowRoles("admin"),getAllSaveJob);
router.get("/:id",verifyToken,allowRoles("admin"),getSaveJob);
router.put("/:id",verifyToken,allowRoles("admin"),updateSaveJob);
router.delete("/:id",verifyToken,allowRoles("admin"),deleteSaveJob);

export default router;