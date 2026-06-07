import express from "express";
const router=express.Router();
import { addCompany,getAllCompany,getCompany,updateCompany,deleteCompany } from "../controller/companyController.js";
import {verifyToken} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";

router.post("/",verifyToken,allowRoles("admin"),addCompany);
router.get("/",verifyToken,allowRoles("admin"),getAllCompany);
router.get("/:id",verifyToken,allowRoles("admin"),getCompany);
router.put("/:id",verifyToken,allowRoles("admin"),updateCompany);
router.delete("/:id",verifyToken,allowRoles("admin"),deleteCompany);

export default router; 