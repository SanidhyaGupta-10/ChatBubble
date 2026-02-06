import type { Response, Request, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/User.model";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next:NextFunction) {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({
                error: "User not found"
            });
            return;
        };

        res.status(200).json(user);
    } catch (error) {
        res.status(500)
        next(error);
    }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId: clerkId } = getAuth(req);

        if (!clerkId) {
            console.error("❌ No clerkId in auth");
            return res.status(401).json({
                message: "Unauthorized - No Clerk ID found",
            });
        }

        console.log(`📌 Auth callback for clerkId: ${clerkId}`);
        
        let user = await User.findOne({ clerkId });

        if (!user) {
            console.log(`👤 New user detected, creating from Clerk...`);
            // get user info from clerk to save in db
            const clerkUser = await clerkClient.users.getUser(clerkId);

            user = await User.create({
                clerkId,
                name: clerkUser.firstName
                    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
                    : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0],
                email: clerkUser.emailAddresses[0]?.emailAddress,
                avatar: clerkUser.imageUrl,
            });
            console.log(`✅ User created: ${user.name}`);
        } else {
            console.log(`✅ User found: ${user.name}`);
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Auth callback error:", error);
        res.status(500).json({
            message: "Auth callback failed",
            details: error instanceof Error ? error.message : "Unknown error"
        });
        next(error);
    }
};