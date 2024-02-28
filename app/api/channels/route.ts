import currentProfile from "@/lib/current-profile";
import prisma from "@/prisma/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, type } = await request.json();
        const profile = await currentProfile();

        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const url = new URL(request.url);
        const serverId = url.searchParams.get("serverId");
        if (!serverId)
            return NextResponse.json("ServerId Missing", { status: 400 });

        if (name === "general")
            return NextResponse.json("Channel name can't be 'general'", {
                status: 400,
            });

        const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    create: { name, type, profileId: profile.id },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("POST CHANNELS ERROR : ", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
