import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/User.model";

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        if (!userId) {
            console.error("❌ User ID not found in request");
            return res.status(401).json({ error: "User ID not found in request" });
        }

        console.log(`📌 Fetching users for userId: ${userId}`);
        
        const users = await User.find({ _id: { $ne: userId } })
            .select("_id name email avatar")
            .limit(50);

        console.log(`✅ Found ${users.length} users`);
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ 
            error: "Failed to fetch users",
            details: error instanceof Error ? error.message : "Unknown error"
        });
        next(error);
    }
};