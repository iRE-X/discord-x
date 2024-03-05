import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Message } from "@prisma/client";

const MESSAGE_BATCH_SIZE = 10;

export async function GET(request: Request) {
    try {
        const profile = await currentProfile();
        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const { searchParams } = new URL(request.url);
        const channelId = searchParams.get("channelId");
        const cursor = searchParams.get("cursor");

        if (!channelId)
            return NextResponse.json(
                { error: "channelId missing" },
                { status: 400 }
            );

        let messages: Message[] = [];

        if (cursor) {
            messages = await prisma.message.findMany({
                take: MESSAGE_BATCH_SIZE,
                cursor: {
                    id: cursor,
                },
                skip: 1,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            messages = await prisma.message.findMany({
                take: MESSAGE_BATCH_SIZE,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        let nextCursor = null;

        if (messages.length === MESSAGE_BATCH_SIZE) {
            nextCursor = messages[MESSAGE_BATCH_SIZE - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor,
        });
    } catch (error) {
        console.log("MESSAGES-GET ERROR", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
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

        const { content, fileUrl } = await req.json();

        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
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

        const member = server.members.find(
            member => member.profileId === profile.id
        );

        if (!member)
            return NextResponse.json(
                { error: "Member not found" },
                { status: 404 }
            );

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

        return NextResponse.json(message);
    } catch (error) {
        console.log("MESSAGE-POST ERROR: ", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
