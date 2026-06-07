import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const {Pool}=pkg;
const pool=new Pool({
    user:process.env.DB_USER||"postgres",
    host:process.env.DB_HOST||"localhost",
    password:process.env.DB_PASSWORD||"faisal.12",
    database:process.env.DB_NAME||"jobportal",
})
export default pool;