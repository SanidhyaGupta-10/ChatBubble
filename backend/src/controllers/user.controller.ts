import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/User.model";

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 50;
        const skip = (page - 1) * limit;

        if (!userId) {
            console.error("❌ User ID not found in request");
            return res.status(401).json({ error: "User ID not found in request" });
        }

        console.log(`📌 Fetching users for userId: ${userId}, page: ${page}`);
        
        const users = await User.find({ _id: { $ne: userId } })
            .select("_id name email avatar")
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments({ _id: { $ne: userId } });

        console.log(`✅ Found ${users.length} users (total: ${total})`);
        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ 
            error: "Failed to fetch users",
            details: error instanceof Error ? error.message : "Unknown error"
        });
        next(error);
    }
};