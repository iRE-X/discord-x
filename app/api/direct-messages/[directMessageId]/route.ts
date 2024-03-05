import currentProfile from "@/lib/current-profile";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

interface Props {
    params: {
        directMessageId: string;
    };
}

export async function PATCH(
    req: Request,
    { params: { directMessageId } }: Props
) {
    try {
        const profile = await currentProfile();
        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get("conversationId");

        const { content } = await req.json();

        if (!conversationId)
            return NextResponse.json(
                { error: "conversation ID is missing" },
                { status: 400 }
            );
        if (!directMessageId)
            return NextResponse.json(
                { error: "directMessage Id is missing" },
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
                { error: "Conversation not found" },
                { status: 404 }
            );

        let message = await prisma.directMessage.findUnique({
            where: {
                id: directMessageId,
                conversationId,
            },
        });

        if (!message || message.deleted)
            return NextResponse.json(
                { error: "Message not found" },
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

        const isOwner = member?.id === message?.memberId;

        if (!isOwner)
            return NextResponse.json(
                { error: "Unauthorized to Edit message" },
                { status: 401 }
            );

        message = await prisma.directMessage.update({
            where: {
                id: directMessageId,
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
        console.log("MESSAGE_ID ERROR: ", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params: { directMessageId } }: Props
) {
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
        if (!directMessageId)
            return NextResponse.json(
                { error: "directMessage Id is missing" },
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
                { error: "Conversation not found" },
                { status: 404 }
            );

        let message = await prisma.directMessage.findUnique({
            where: {
                id: directMessageId,
                conversationId,
            },
        });

        if (!message || message.deleted)
            return NextResponse.json(
                { error: "Message not found" },
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

        const isOwner = member?.id === message?.memberId;
        const isAdmin = member?.role === "ADMIN";
        const isModerator = member?.role === "MODERATOR";

        const canDelete = isAdmin || isModerator || isOwner;

        if (!canDelete)
            return NextResponse.json(
                { error: "Unauthorized to Delete Message" },
                { status: 401 }
            );

        message = await prisma.directMessage.update({
            where: {
                id: directMessageId,
                conversationId,
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
        console.log("MESSAGE_ID ERROR: ", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
