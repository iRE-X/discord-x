import currentProfilePages from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "DELETE" && req.method !== "PATCH")
        return res.status(405).json({ error: "Method Not Allowed" });

    try {
        const profile = await currentProfilePages(req);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        const { conversationId, directMessageId } = req.query;
        const { content } = req.body;

        if (!conversationId)
            return res
                .status(400)
                .json({ error: "conversation Id is missing" });

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId as string,
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!conversation)
            return res.status(404).json({ error: "Conversation not found" });

        let message = await prisma.directMessage.findUnique({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string,
            },
        });

        if (!message || message.deleted)
            return res.status(404).json({ error: "Message not found" });

        const member =
            conversation.memberOne.profileId === profile.id
                ? conversation.memberOne
                : conversation.memberTwo;

        if (!member) return res.status(404).json({ error: "Member not found" });

        const isOwner = member?.id === message?.memberId;
        const isAdmin = member?.role === "ADMIN";
        const isModerator = member?.role === "MODERATOR";

        const canModify = isAdmin || isModerator || isOwner;

        if (!canModify)
            return res.status(401).json({ error: "Unauthorized to modify" });
        if (req.method === "DELETE") {
            message = await prisma.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    content: "This message has been deleted",
                    fileUrl: null,
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }

        if (req.method === "PATCH") {
            if (!isOwner)
                return res
                    .status(401)
                    .json({ error: "Unauthorized to Edit message" });

            message = await prisma.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }

        // const updateKey = `chat:${conversationId}:messages:update`;
        // res.socket.server.io.emit(updateKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("SOCKET-DIRECT-MESSAGE_ID ERROR: ", error);
        return res.status(500).json({ error: "Internal Error" });
    }
};

export default handler;
