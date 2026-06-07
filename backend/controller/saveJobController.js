import pool from "../config/db.js";

export const addSaveJob=async(req,res)=>{
    try{
        const {user_id,job_id}=req.body;
        if(!user_id || !job_id){
            return res.status(400).json("All fields are required");
        }
        const result=await pool.query(`INSERT INTO saved_jobs (user_id,job_id) VALUES($1,$2)RETURNING *`,[user_id,job_id]);
        return res.status(200).json({message:"save job add successfully",data:result.rows[0]});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getAllSaveJob=async(req,res)=>{
    try{
        const result=await pool.query(`SELECT * FROM saved_jobs`);
        return res.status(200).json(result.rows);
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getSaveJob=async(req,res)=>{
    try{
        const {id}=req.params;
        const result=await pool.query(`SELECT * FROM saved_jobs WHERE saved_id=$1`,[id]);
         if(result.rows.length==0){
            return res.status(401).json("data is not found");
        }
        return res.status(200).json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const updateSaveJob=async(req,res)=>{
    try{
        const{id}=req.params;
        const {user_id,job_id}=req.body;
        if(!user_id || !job_id){
            return res.status(400).json("All fields are required");
        }
        const result=await pool.query(`UPDATE saved_jobs SET user_id=$1,job_id=$2 WHERE saved_id=$3 RETURNING *`,[user_id,job_id,id]);
        if(result.rows.length==0){
            return res.status(401).json("data is not found");
        }
        return res.status(200).json({message:"save job update successfully",data:result.rows[0]});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const deleteSaveJob=async(req,res)=>{
    try{
        const {id}=req.params;
       const result = await pool.query(`DELETE FROM saved_jobs WHERE saved_id=$1 RETURNING *`,[id]);
       if(result.rows.length === 0){
        return res.status(404).json("data is not found");
    }
        return res.status(200).json({message:"save job delete succesfully"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}