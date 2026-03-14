import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../config/prisma";

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
        
        const users = await prisma.user.findMany({
            where: {
                NOT: { id: userId }
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true
            },
            orderBy: {
                id: 'asc'
            },
            skip: skip,
            take: limit
        });

        const total = await prisma.user.count({
            where: {
                NOT: { id: userId }
            }
        });

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