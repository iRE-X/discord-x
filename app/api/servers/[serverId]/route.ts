import currentProfile from "@/lib/current-profile";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params: { serverId } }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );

        const { name, imageUrl } = await request.json();

        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
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
    { params: { serverId } }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );

        const server = await prisma.server.delete({
            where: {
                id: serverId,
                profileId: profile.id,
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("SERVER-ID-DELETE ERROR");
        return NextResponse.json({ error }, { status: 400 });
    }
}
