import pool from "../config/db.js";
export const addJob=async(req,res)=>{
    try{
        const {company_id,title,description,salary,location,job_type,category}=req.body;
        if(!company_id || !title || !description || !salary || !location || !job_type || !category){
            return res.status(400).json("All fileds are required");
        }
        const result=await pool.query(`INSERT INTO jobs(company_id,title,description,salary,location,job_type,category)VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING *`,[company_id,title,description,salary,location,job_type,category]);
        return res.status(200).json({message:"jobs adds successfully",data:result.rows[0]});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getAllJob=async(req,res)=>{
    try{
        const result=await pool.query(`SELECT * FROM jobs`);
        return res.status(200).json(result.rows);
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getJob=async(req,res)=>{
    try{
        const {id}=req.params;
        const result=await pool.query(`SELECT * FROM jobs WHERE job_id=$1`,[id]);
        if(result.rows.length==0){
            return res.status(401).json("Data is not found");
        }
        return res.status(200).json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}


export const updateJob=async(req,res)=>{
    try{
        const {id}=req.params;
        const {company_id,title,description,salary,location,job_type,category}=req.body;
        if(!company_id || !title || !description || !salary || !location || !job_type || !category){
            return res.status(400).json("All fileds are required");
        }
        const result=await pool.query(`UPDATE jobs set company_id=$1,title=$2,description=$3,salary=$4,location=$5,job_type=$6,category=$7 WHERE job_id=$8 RETURNING *`,[company_id,title,description,salary,location,job_type,category,id]);
        if(result.rows.length==0){
            return res.status(401).json("Data is not found");
        }
        return res.status(200).json({message:"jobs update successfully",data:result.rows[0]});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const deleteJob=async(req,res)=>{
    try{
        const {id}=req.params;
        const result = await pool.query(`DELETE FROM jobs WHERE job_id=$1 RETURNING *`,[id]);
        if(result.rows.length==0){
            return res.status(401).json("Data is not found");
        }
        return res.status(200).json({message:"Job delete successfuly"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}