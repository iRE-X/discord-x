import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { MemberRole } from "@prisma/client";

export async function PATCH(
    request: Request,
    { params: { channelId } }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );

        const { searchParams } = new URL(request.url);
        const serverId = searchParams.get("serverId");

        if (!serverId)
            return NextResponse.json(
                { error: "serverId missing" },
                { status: 400 }
            );

        if (!channelId)
            return NextResponse.json(
                { error: "channelId missing" },
                { status: 400 }
            );

        const { name, type } = await request.json();

        if (name === "general")
            return NextResponse.json(
                { error: "name can't be 'general'" },
                { status: 400 }
            );

        const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            not: MemberRole.GUEST,
                        },
                    },
                },
            },

            data: {
                channels: {
                    update: {
                        where: {
                            id: channelId,
                            name: {
                                not: "general",
                            },
                        },
                        data: {
                            name,
                            type,
                        },
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("SERVER-ID-PATCH ERROR");
        return NextResponse.json({ error }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params: { channelId } }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );

        const { searchParams } = new URL(request.url);
        const serverId = searchParams.get("serverId");

        if (!channelId)
            return NextResponse.json(
                { error: "channelId missing" },
                { status: 400 }
            );

        if (!serverId)
            return NextResponse.json(
                { error: "serverId missing" },
                { status: 400 }
            );

        const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            not: MemberRole.GUEST,
                        },
                    },
                },
            },

            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general",
                        },
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("SERVER-ID-DELETE ERROR");
        return NextResponse.json({ error }, { status: 400 });
    }
}
