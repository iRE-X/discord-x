import currentProfile from "@/lib/current-profile";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

interface Props {
    params: {
        messageId: string;
    };
}

export async function PATCH(req: Request, { params: { messageId } }: Props) {
    try {
        const profile = await currentProfile();
        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        const channelId = searchParams.get("channelId");

        const { content } = await req.json();

        console.log(messageId);

        if (!serverId)
            return NextResponse.json(
                { error: "serverId is missing" },
                { status: 400 }
            );
        if (!channelId)
            return NextResponse.json(
                { error: "channelId is missing" },
                { status: 400 }
            );
        if (!messageId)
            return NextResponse.json(
                { error: "messageId is missing" },
                { status: 400 }
            );

        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
                channels: {
                    some: {
                        id: channelId,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        if (!server)
            return NextResponse.json(
                { error: "Server not found" },
                { status: 404 }
            );

        const channel = await prisma.channel.findUnique({
            where: {
                id: channelId,
                serverId: serverId,
            },
        });

        if (!channel)
            return NextResponse.json(
                { error: "Channel not found" },
                { status: 404 }
            );

        let message = await prisma.message.findUnique({
            where: {
                id: messageId,
                channelId: channelId,
            },
        });

        if (!message || message.deleted)
            return NextResponse.json(
                { error: "Message not found" },
                { status: 404 }
            );

        const member = server.members.find(m => m.profileId === profile.id);
        if (!member)
            return NextResponse.json(
                { error: "Member not found" },
                { status: 404 }
            );

        const isOwner = member?.id === message?.memberId;

        if (!isOwner)
            return NextResponse.json(
                { error: "Unauthorized to Edit message" },
                { status: 401 }
            );

        message = await prisma.message.update({
            where: {
                id: messageId,
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

        return NextResponse.json(message);
    } catch (error) {
        console.log("MESSAGE-PATCH ERROR: ", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params: { messageId } }: Props) {
    try {
        const profile = await currentProfile();
        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        const channelId = searchParams.get("channelId");

        if (!serverId)
            return NextResponse.json(
                { error: "serverId is missing" },
                { status: 400 }
            );
        if (!channelId)
            return NextResponse.json(
                { error: "channelId is missing" },
                { status: 400 }
            );
        if (!messageId)
            return NextResponse.json(
                { error: "messageId is missing" },
                { status: 400 }
            );

        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
                channels: {
                    some: {
                        id: channelId,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        if (!server)
            return NextResponse.json(
                { error: "Server not found" },
                { status: 404 }
            );

        const channel = await prisma.channel.findUnique({
            where: {
                id: channelId,
                serverId: serverId,
            },
        });

        if (!channel)
            return NextResponse.json(
                { error: "Channel not found" },
                { status: 404 }
            );

        let message = await prisma.message.findUnique({
            where: {
                id: messageId,
                channelId: channelId,
            },
        });

        if (!message || message.deleted)
            return NextResponse.json(
                { error: "Message not found" },
                { status: 404 }
            );

        const member = server.members.find(m => m.profileId === profile.id);
        if (!member)
            return NextResponse.json(
                { error: "Member not found" },
                { status: 404 }
            );

        const isOwner = member?.id === message?.memberId;
        const isAdmin = member?.role === "ADMIN";
        const isModerator = member?.role === "MODERATOR";

        const canDelete = isAdmin || isModerator || isOwner;

        if (!canDelete)
            return NextResponse.json(
                { error: "Unauthorized to Delete Message" },
                { status: 401 }
            );

        message = await prisma.message.update({
            where: {
                id: messageId,
                channelId,
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

        return NextResponse.json(message);
    } catch (error) {
        console.log("MESSAGE-DELETE ERROR: ", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
