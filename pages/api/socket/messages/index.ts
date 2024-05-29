import { auth } from "@/auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import currentProfile from "@/lib/current-profile";
import currentProfilePages from "@/lib/current-profile-pages";
import prisma from "@/prisma/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method Not Allowed" });

    try {
        const { content, fileUrl } = req.body;
        const { serverId, channelId, profileId } = req.query;

        if (!profileId) return res.status(401).json({ error: "Unauthorized" });
        if (!content) return res.status(401).json({ error: "content missing" });
        if (!serverId)
            return res.status(401).json({ error: "serverId missing" });
        if (!channelId)
            return res.status(401).json({ error: "channelId missing" });

        const server = await prisma.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profileId as string,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        if (!server) return res.status(404).json({ error: "Server not found" });

        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });

        if (!channel)
            return res.status(404).json({ error: "Channel not found" });

        const member = server.members.find(
            member => member.profileId === profileId
        );

        if (!member) return res.status(404).json({ error: "Member not found" });

        const message = await prisma.message.create({
            data: {
                content,
                fileUrl,
                channelId: channel.id,
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

        const channelKey = `chat:${channel.id}:messages`;
        res.socket.server.io.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("SOCKET-MESSAGES ERROR", error);
        return res.status(500).json({ error: "Internal Error" });
    }
};

export default handler;
