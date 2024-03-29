import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { DirectMessage, Message } from "@prisma/client";

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
        const conversationId = searchParams.get("conversationId");
        const cursor = searchParams.get("cursor");

        if (!conversationId)
            return NextResponse.json(
                { error: "conversation ID missing" },
                { status: 400 }
            );

        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await prisma.directMessage.findMany({
                take: MESSAGE_BATCH_SIZE,
                cursor: {
                    id: cursor,
                },
                skip: 1,
                where: {
                    conversationId,
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
            messages = await prisma.directMessage.findMany({
                take: MESSAGE_BATCH_SIZE,
                where: {
                    conversationId,
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
        console.log("DIRECT-MESSAGES-GET ERROR", error);
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
        const conversationId = searchParams.get("conversationId");

        if (!conversationId)
            return NextResponse.json(
                { error: "conversation ID is missing" },
                { status: 400 }
            );

        const { content, fileUrl } = await req.json();

        if (!content)
            return NextResponse.json(
                { error: "content is missing" },
                { status: 400 }
            );

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
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
            return NextResponse.json(
                { error: "conversation not found" },
                { status: 404 }
            );

        const member =
            conversation.memberOne.profileId === profile.id
                ? conversation.memberOne
                : conversation.memberTwo;

        if (!member)
            return NextResponse.json(
                { error: "Member not found" },
                { status: 404 }
            );

        const message = await prisma.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId,
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
        console.log("DIRECT-MESSAGE-POST ERROR: ", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
