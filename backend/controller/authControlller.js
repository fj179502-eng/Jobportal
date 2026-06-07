import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import {generateToken} from "../utiles/generateToken.js";
import jwt from "jsonwebtoken";

export const register=async(req,res)=>{
    try{
        const{name,email,role,password}=req.body;
        if(!name || !email || !role || !password){
            return res.status(400).json("All fileds are required");
        }
        const hashedpassword=await bcrypt.hash(password,10);
        const result=await pool.query(`INSERT INTO users(name,email,role,password)VALUES($1,$2,$3,$4)RETURNING *`,[name,email,role,hashedpassword]);
        return res.status(200).json({message:"your registration successfully",token:generateToken(result.rows[0])})
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT user_id, name,email,role,password FROM users");
        res.json(result.rows);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email){
            return res.status(400).json("All fileds are required");
        }
        const result=await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
        if(result.rows.length==0){
            return res.status(401).json("no token provide");
        }
        const user=result.rows[0];
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json("Invalid Email or Password");
        }
        const token=jwt.sign(
            {user_id:user.user_id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        res.json({message:"Login successfully",token,user:{
            user_id:user.user_id,
            name:user.name,
            email:user.email,
            role:user.role,
            password:user.password,
        }})
    }
    catch(err){
        console.error(err.message);
        return res.status(500).json("Database Error");
    }
}
