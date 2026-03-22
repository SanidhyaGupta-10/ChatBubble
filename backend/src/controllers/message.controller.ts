import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware"
import prisma from "../config/prisma";
import { serializeMessage } from "../utils/serializers";

export async function getMessages(req: AuthRequest, res: Response, next:NextFunction) {
    try {
        const userId = req.userId as string;
        const chatId = req.params.chatId as string;

        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                participants: {
                    some: { id: userId }
                }
            }
        });

        if(!chat){
            res.status(404).json({
                message: "Chat not found"
            });
            return
        };

        const messages = await prisma.message.findMany({
            where: {
                chatId: chatId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc',
            }
        });

        res.json(messages.map(serializeMessage))

    } catch (error) {
        res.status(500),
        next(error)
    }
}
