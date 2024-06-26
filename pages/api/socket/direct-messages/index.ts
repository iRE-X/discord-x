import currentProfilePages from "@/lib/current-profile-pages";
import prisma from "@/prisma/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method Not Allowed" });

    try {
        const { content, fileUrl } = req.body;
        const { conversationId, profileId } = req.query;

        if (!profileId) return res.status(401).json({ error: "Unauthorized" });
        if (!content) return res.status(400).json({ error: "content missing" });
        if (!conversationId)
            return res.status(401).json({ error: "conversation ID missing" });

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

        const member =
            conversation.memberOne.profileId === profileId
                ? conversation.memberOne
                : conversation.memberTwo;

        if (!member) return res.status(404).json({ error: "Member not found" });

        const message = await prisma.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversation.id,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        const conversationKey = `chat:${conversationId}:messages`;
        res.socket.server.io.emit(conversationKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("SOCKET-DIRECT-MESSAGES ERROR", error);
        return res.status(500).json({ error: "Internal Error" });
    }
};

export default handler;
