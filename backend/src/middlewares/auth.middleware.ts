import { getAuth, requireAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import User from "../models/User.model";

export type AuthRequest = Request & {
    userId? : string
}

export const protectedRoute = [
    requireAuth(),
    async ( req: AuthRequest, res: Response, next: NextFunction ) => {
        try {   
            const { userId: clerkId } = getAuth(req);  
            if(!clerkId) return res.status(401).json({
                message: "Unauthorized - Invalid Token",
            });

            const user = await User.findOne({ clerkId });
            if(!user) return res.status(404).json({
                 message: "User not found"
            });

            req.userId =  user._id.toString();
        } catch (error) {
            console.log(error);
            res.status(500);
            next(error);
        };
    }
];