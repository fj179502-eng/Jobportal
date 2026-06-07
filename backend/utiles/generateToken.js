import jwt from "jsonwebtoken";
export const generateToken=(user)=>{
    return jwt.sign(
        {user_id:user.user_id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"7d"},
    )
}

export const refreshToken=(user)=>{
    return jwt.sign(
        {user_id:user.user_id,},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:"7d"},
    )
}