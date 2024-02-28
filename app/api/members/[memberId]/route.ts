import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import prisma from "@/prisma/db";

interface Props {
    params: {
        memberId: string;
    };
}

export async function PATCH(request: Request, { params: { memberId } }: Props) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json("Unauthorized", { status: 401 });
        if (!memberId)
            return NextResponse.json("MemberId Missing", { status: 400 });

        const url = new URL(request.url);
        const serverId = url.searchParams.get("serverId");
        if (!serverId)
            return NextResponse.json("ServerId Missing", { status: 400 });

        const { role } = await request.json();

        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                        },
                        data: {
                            role,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        return NextResponse.json(
            { error, message: "MEMBERID PATCH ERROR" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params: { memberId } }: Props
) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json("Unauthorized", { status: 401 });
        if (!memberId)
            return NextResponse.json("MemberId Missing", { status: 400 });

        const url = new URL(request.url);
        const serverId = url.searchParams.get("serverId");
        if (!serverId)
            return NextResponse.json("ServerId Missing", { status: 400 });

        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        return NextResponse.json(
            { error, message: "MEMBERID DELETE ERROR" },
            { status: 500 }
        );
    }
}
