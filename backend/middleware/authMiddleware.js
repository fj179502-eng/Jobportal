import jwt, { decode } from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.split(" ")[1];
    if (!token || token === "null" || token === "undefined") {
        return res.status(403).json({ message: "No token Provide" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decode;
        next();
    });
};