import pool from"../config/db.js";

export const addProfile=async(req,res)=>{
    try{
        const {user_id,skills,experience,education}=req.body;
        const resume_url=req.file ? req.file.filename:null;
        if(!user_id || !skills || !experience || !education|| !resume_url){
            return res.status(400).json("All fields are required");
        }
        const reuslt=await pool.query(`INSERT INTO profiles(user_id,skills,experience,education,resume_url)VALUES($1,$2,$3,$4,$5) RETURNING *`,[user_id,skills,experience,education,resume_url]);
        return res.status(200).json({message:"profile add successfully",data:reuslt.rows[0]});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getAllProfile=async(req,res)=>{
    try{
        const result=await pool.query(`SELECT * FROM profiles`);
        res.status(200).json(result.rows);
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getProfile=async(req,res)=>{
    try{
        const {id}=req.params;
        const result=await pool.query(`SELECT * FROM profiles WHERE profile_id=$1`,[id]);
        if(result.rows.length==0){
            return res.status(401).josn("Data is not found");
        }
        return res.status(200).json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, skills, experience, education } = req.body;
        const resume_url = req.file ? req.file.filename : null;
        let query, values;
        if (resume_url) {
            query = `UPDATE profiles SET user_id=$1, skills=$2, experience=$3, education=$4, resume_url=$5 WHERE profile_id=$6 RETURNING * `; values = [user_id, skills, experience, education, resume_url, id];
        } 
        else {
            query = `UPDATE profiles SET user_id=$1, skills=$2, experience=$3, education=$4 WHERE profile_id=$5 RETURNING *`;values = [user_id, skills, experience, education, id];}
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            data: result.rows[0]
        });

    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database Error" });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM profiles WHERE profile_id=$1 RETURNING *`,[id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Data not found" });
        }
        return res.status(200).json({message: "Profile deleted successfully"});

    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};