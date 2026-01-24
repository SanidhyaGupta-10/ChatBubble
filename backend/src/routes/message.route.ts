import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware";
import { getMessages } from "../controllers/message.controller";

const router = Router();

router.get('/chat/:chatId', protectedRoute, getMessages)

export default router;