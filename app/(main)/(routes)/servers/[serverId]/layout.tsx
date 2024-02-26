import ServerSidebar from "@/components/server/Server-Sidebar";
import currentProfile from "@/lib/current-profile";
import { redirect } from "next/navigation";
import prisma from "@/prisma/db";
import React from "react";

interface Props {
    children: React.ReactNode;
    params: { serverId: string };
}

const ServerIdLayout = async ({ children, params: { serverId } }: Props) => {
    const profile = await currentProfile();

    if (!profile) redirect("/sign-in");

    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (!server) redirect("/");

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 flex-col fixed {z-20 inset-y-0}">
                <ServerSidebar serverId={serverId} />
            </div>
            <main className="h-full md:pl-60">{children}</main>
        </div>
    );
};

export default ServerIdLayout;
