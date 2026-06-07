import express from "express";
const router=express.Router();
import {register,login,getAllUsers} from "../controller/authControlller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.post("/register",register);
router.post("/login",login);
router.get("/users", verifyToken, getAllUsers);

export default router;