export const allowRoles = (...roles) => {
    return (req, res, next) => {
        console.log("Required Roles:", roles);
        console.log("User Role from token ", req.user?.role);
        if (!roles.includes(req.user.role)) {
            console.log("Access Denied:Role Mismatch");
            return res.status(403).json({ message: "Access Denied" });
        }
        next();
    }
}