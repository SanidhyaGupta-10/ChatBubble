import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware";
import { getUsers } from "../controllers/user.controller";

const router = Router();
// get request on /api/users
router.get('/', protectedRoute,  getUsers)

export default router;