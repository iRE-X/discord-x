import currentProfile from "@/lib/current-profile";
import prisma from "@/prisma/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params: { serverId } }: { params: { serverId: string } }
) {
    const profile = await currentProfile();

    if (!profile)
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    if (!serverId)
        return NextResponse.json(
            { error: "Server ID missing." },
            { status: 400 }
        );

    const server = await prisma.server.update({
        where: {
            id: serverId,
            profileId: profile.id,
        },
        data: {
            inviteCode: uuidv4(),
        },
    });

    return NextResponse.json(server);
}
