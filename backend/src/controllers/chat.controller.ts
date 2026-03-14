import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../config/prisma";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId as string;
        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: { id: userId }
                }
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                lastMessage: true
            },
            orderBy: {
                lastMessageAt: 'desc'
            }
        });

        const formattedChats = chats.map(chat => {
            const otherParticipant = chat.participants.find(p => p.id !== userId);

            return {
                id: chat.id,
                participant: otherParticipant ?? null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt,
            }
        });
        res.json(formattedChats);
    } catch (error) {
        res.status(500);
        next(error);
    }
};

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId as string;
        const participantId = req.params.participantId as string;

        if(!participantId){
            res.status(400).json({
                message: "Participant id is required"
            });
            return;
        }

        if(userId === participantId){
            res.status(400).json({
                message: "You cannot start a chat with yourself"
            });
            return;
        }

        // Find chat with both participants
        let chat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: userId } } },
                    { participants: { some: { id: participantId } } }
                ]
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                lastMessage: true
            }
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    participants: {
                        connect: [
                            { id: userId },
                            { id: participantId }
                        ]
                    }
                },
                include: {
                    participants: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true
                        }
                    },
                    lastMessage: true
                }
            });
        }

        const otherParticipant = chat.participants.find(p => p.id !== userId);

        res.json({
            id: chat.id,
            participant: otherParticipant ?? null,
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt,
        })
    } catch (error) {
        res.status(500);
        next(error);
    }
};    
