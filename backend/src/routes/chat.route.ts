import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware";
import { getChats, getOrCreateChat } from "../controllers/chat.controller";

const router = Router();

router.use(protectedRoute);

router.get('/', getChats)
router.post('/with/:participantsId', getOrCreateChat)

export default router;