import { getAuth, requireAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import User from "../models/User.model";

export const protectedRoute = [
    requireAuth(),
    async ( req: Request, res: Response, next: NextFunction ) => {
        try {   
                
        } catch (error) {
            
        }
    }
]