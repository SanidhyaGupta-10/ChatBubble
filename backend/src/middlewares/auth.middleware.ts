import { getAuth, requireAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export interface AuthRequest extends Request {
    userId?: string;
}

export const protectedRoute = [
    requireAuth(),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {   
            const { userId: clerkId } = getAuth(req);  
            
            if (!clerkId) {
                res.status(401).json({
                    message: "Unauthorized - Invalid Token",
                });
                return;
            }

            const user = await prisma.user.findUnique({ 
                where: { clerkId } 
            });

            if (!user) {
                res.status(404).json({
                    message: "User not found"
                });
                return;
            }

            req.userId = user.id;
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            next(error);
        }
    }
];