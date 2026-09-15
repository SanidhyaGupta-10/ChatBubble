import type { Response, Request, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../config/prisma";
import { clerkClient, getAuth } from "@clerk/express";
import { serializeUser } from "../utils/serializers";

export async function getMe(req: AuthRequest, res: Response, next:NextFunction) {
    try {
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.status(404).json({
                error: "User not found"
            });
            return;
        };

        res.status(200).json(serializeUser(user));
    } catch (error) {
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

        // Get latest user info from Clerk to ensure DB is in sync
        const clerkUser = await clerkClient.users.getUser(clerkId);
        const fullName = clerkUser.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
            : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] || "Unknown";

        const user = await prisma.user.upsert({
            where: { clerkId },
            update: {
                name: fullName,
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                avatar: clerkUser.imageUrl || "",
            },
            create: {
                clerkId,
                name: fullName,
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                avatar: clerkUser.imageUrl || "",
            },
        });

        console.log(`✅ User processed: ${user.name}`);
        res.json(serializeUser(user));
    } catch (error) {
        console.error("❌ Auth callback error:", error);
        next(error);
    }
};
