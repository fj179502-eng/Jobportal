import express from "express";
const router=express.Router();
import { addJob,getAllJob,getJob,updateJob,deleteJob} from "../controller/jobController.js";
import {verifyToken} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";

router.post("/", verifyToken, allowRoles("admin"), addJob);
router.get("/",verifyToken,allowRoles("admin"),getAllJob);
router.get("/:id",verifyToken,allowRoles("admin"),getJob);
router.put("/:id",verifyToken,allowRoles("admin"),updateJob);
router.delete("/:id",verifyToken,allowRoles("admin"),deleteJob);

export default router;