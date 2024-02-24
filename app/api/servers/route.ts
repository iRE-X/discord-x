import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const { name, imageUrl } = await request.json();
        const profile = await currentProfile();

        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const server = await prisma.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [{ name: "general", profileId: profile.id }],
                },
                members: {
                    create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("POST SERVERS ERROR : ", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
