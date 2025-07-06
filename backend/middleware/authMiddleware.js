import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            req.user = user;
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
            }
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

    } catch (error) {
        console.error("Error in authMiddleware:", error);
        return res.status(500).json({ success: false, message: "Internal server error in middleware" });
    }
};

export default authMiddleware;
