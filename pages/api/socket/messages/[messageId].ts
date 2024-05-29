import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import prisma from "@/prisma/db";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (req.method !== "DELETE" && req.method !== "PATCH")
        return res.status(405).json({ error: "Method Not Allowed" });

    try {
        const { serverId, channelId, messageId, profileId } = req.query;
        const { content } = req.body;

        if (!profileId) return res.status(401).json({ error: "Unauthorized" });
        if (!serverId)
            return res.status(400).json({ error: "serverId is missing" });
        if (!channelId)
            return res.status(400).json({ error: "channelId is missing" });
        if (!messageId)
            return res.status(400).json({ error: "messageId is missing" });

        const server = await prisma.server.findFirst({
            where: {
                id: serverId as string,
                channels: {
                    some: {
                        id: channelId as string,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        if (!server) return res.status(404).json({ error: "Server not found" });

        const channel = await prisma.channel.findUnique({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });

        if (!channel)
            return res.status(404).json({ error: "Channel not found" });

        let message = await prisma.message.findUnique({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            },
        });

        if (!message || message.deleted)
            return res.status(404).json({ error: "Message not found" });

        const member = server?.members.find(m => m.profileId === profileId);
        if (!member) return res.status(404).json({ error: "Member not found" });

        const isOwner = member?.id === message?.memberId;
        const isAdmin = member?.role === "ADMIN";
        const isModerator = member?.role === "MODERATOR";

        const canModify = isAdmin || isModerator || isOwner;

        if (!canModify)
            return res.status(401).json({ error: "Unauthorized to modify" });
        if (req.method === "DELETE") {
            message = await prisma.message.update({
                where: {
                    id: messageId as string,
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

            message = await prisma.message.update({
                where: {
                    id: messageId as string,
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

        const updateKey = `chat:${channelId}:messages:update`;
        res.socket.server.io.emit(updateKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("SOCKET-MESSAGE_ID ERROR: ", error);
        return res.status(500).json({ error: "Internal Error" });
    }
};

export default handler;
