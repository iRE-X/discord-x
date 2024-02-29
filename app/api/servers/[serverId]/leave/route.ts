import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import prisma from "@/prisma/db";

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

        if (!serverId)
            return NextResponse.json(
                { error: "serverId missing" },
                { status: 400 }
            );

        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: profile.id,
                },
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id,
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("SERVER-API-LEAVE-ERROR: ", error);
        return NextResponse.json(error, { status: 500 });
    }
}
