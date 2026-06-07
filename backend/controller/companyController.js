import pool from "../config/db.js";
export const addCompany = async (req, res) => {
    try {
        const { user_id, company_name, description, website, location } = req.body;
        if (!user_id || !company_name || !description || !website || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const result = await pool.query(
            `INSERT INTO companies (user_id, company_name, description, website, location)VALUES ($1, $2, $3, $4, $5) RETURNING *`, [user_id, company_name, description, website, location]
        );

        return res.status(200).json({
            message: "Company added successfully",
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};

export const getAllCompany = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM companies`);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};
export const getCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM companies WHERE company_id=$1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Data not found" });
        }
        return res.status(200).json(result.rows[0]);

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, company_name, description, website, location } = req.body;
        if (!user_id || !company_name || !description || !website || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await pool.query(`UPDATE companies SET user_id=$1, company_name=$2, description=$3, website=$4, location=$5 WHERE company_id=$6 RETURNING *`, [user_id, company_name, description, website, location, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Data not found" });
        }

        return res.status(200).json({ message: "Company updated successfully", data: result.rows[0] });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM companies WHERE company_id=$1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Data not found" });
        }
        return res.status(200).json({ message: "Company deleted successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};