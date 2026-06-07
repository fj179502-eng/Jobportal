import pool from "../config/db.js";
export const addCategory=async(req,res)=>{
    try{
        const{name}=req.body;
        if(!name){
            return res.status(400).json("All Fields are required");
        }
        const result=await pool.query(`INSERT INTO categories (name)VALUES($1)RETURNING *`,[name]);
        return res.status(200).json({message:"Category Add succesfully",data:result.rows[0]});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getAllCategory = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM categories`);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};

export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM categories WHERE category_id=$1`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json("Data not found");
        }

        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};

export const updateCategory=async(req,res)=>{
    try{
        const {id}=req.params;
        const{name}=req.body;
        if(!name){
            return res.status(400).json("All Fields are required");
        }
        const result=await pool.query(`UPDATE categories SET name=$1 WHERE category_id=$2 RETURNING *`,[name,id]);
        if(result.rows.length==0){
            return res.status(401).json("Data is not found");
        }
        return res.status(200).json({message:"Category Update succesfully",data:result.rows[0]});
    }
    catch(err){
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `DELETE FROM categories WHERE category_id=$1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json("Data not found");
        }

        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};