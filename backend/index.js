import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./route/authRoute.js";
import companyRoute from "./route/companyRoute.js";
import jobRoute from "./route/jobRoute.js";
import applicationRoute from "./route/applicationRoute.js";
import profileRoute from "./route/profileRoute.js";
import saveJobRoute from "./route/saveJobRoute.js";
import categoryRoute from "./route/categoryRoute.js";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", authRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);
app.use("/api/profile", profileRoute);
app.use("/api/savejob", saveJobRoute);
app.use("/api/category", categoryRoute);

app.use("/uploads", express.static("uploads"));


app.listen(PORT, () => {
    console.log(`Server is running on the port http://localhost:${PORT}`);
});