import pool from "../config/db.js";
export const addApplication = async (req, res) => {
    try {
        const { job_id, user_id, cover_letter, status } = req.body;
        const cv_url = req.file ? req.file.filename : null;
        if (!job_id || !user_id || !cover_letter || !cv_url || !status) {
            return res.status(400).json({ message: "All fields required" });
        }
        const result = await pool.query(`INSERT INTO applications(job_id,user_id,cover_letter,cv_url,status)VALUES($1,$2,$3,$4,$5) RETURNING *`,[job_id, user_id, cover_letter, cv_url, status]);
        res.json(result.rows[0]);

    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
};

export const getAllApplication=async(req,res)=>{
    try{
        const result=await pool.query(`SELECT * FROM applications`);
        return res.status(200).json(result.rows);
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getApplication=async(req,res)=>{
    try{
        const {id}=req.params;
        const result=await pool.query(`SELECT * FROM applications WHERE application_id=$1`,[id]);
        if(result.rows.length==0){
            return res.status(401).json("Data is not found")
        }
        return res.status(200).json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { job_id, user_id, cover_letter, status } = req.body;
        const cv_url = req.file ? req.file.filename : null;
        if (!job_id || !user_id || !cover_letter || !status) {
            return res.status(400).json({ message: "Required fields missing" });
        }
        let query, values;

        if (cv_url) {
            query = `UPDATE applications  SET job_id=$1, user_id=$2, cover_letter=$3, cv_url=$4, status=$5  WHERE application_id=$6  RETURNING *`;values = [job_id, user_id, cover_letter, cv_url, status, id];
        } 
        else {
            query = `UPDATE applications  SET job_id=$1, user_id=$2, cover_letter=$3, status=$4  WHERE application_id=$5  RETURNING * `;values = [job_id, user_id, cover_letter, status, id];
        }
        const result = await pool.query(query, values);
        return res.status(200).json({
            message: "Updated successfully",
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};

export const deleteApplication=async(req,res)=>{
    try{
        const {id}=req.params;
        const result=await pool.query(`DELETE FROM applications WHERE application_id=$1 RETURNING *`,[id]);
        if(result.rows.length==0){
            return res.status(401).json("Data is not found")
        }
        return res.status(200).json({message:"application delete successfully"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}