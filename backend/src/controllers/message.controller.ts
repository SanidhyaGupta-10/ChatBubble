import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware"
import prisma from "../config/prisma";
import { serializeMessage } from "../utils/serializers";

export async function getMessages(req: AuthRequest, res: Response, next:NextFunction) {
    try {
        const userId = req.userId;
        const chatId = req.params.chatId as string;
        const cursor = req.query.cursor as string;
        const limit = parseInt(req.query.limit as string) || 50;

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
            },
            take: limit,
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
        });

        const nextCursor = messages.length === limit ? messages[messages.length - 1]?.id : null;

        res.json({
            messages: messages.map(serializeMessage),
            nextCursor
        })

    } catch (error) {
        next(error)
    }
}
