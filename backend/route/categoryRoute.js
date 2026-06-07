import express from "express";

const router=express.Router();
import { addCategory,getAllCategory,getCategory,updateCategory,deleteCategory } from "../controller/categoryController.js";
import {verifyToken} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";

router.post("/",verifyToken,allowRoles("admin"),addCategory);
router.get("/",verifyToken,allowRoles("admin"),getAllCategory);
router.get("/:id",verifyToken,allowRoles("admin"),getCategory);
router.put("/:id",verifyToken,allowRoles("admin"),updateCategory);
router.delete("/:id",verifyToken,allowRoles("admin"),deleteCategory);

export default router;