import currentProfile from "@/lib/current-profile";
import { redirect } from "next/navigation";
import prisma from "@/prisma/db";
import React from "react";
import { ChannelType } from "@prisma/client";
import ServerHeader from "./Server-Header";

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
    const profile = await currentProfile();

    if (!profile) redirect("/sign-in");

    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
        },

        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },

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

    if (!server) redirect("/");

    const textChannels = server.channels.filter(
        channel => channel.type === ChannelType.TEXT
    );
    const audioChannels = server.channels.filter(
        channel => channel.type === ChannelType.AUDIO
    );
    const videoChannels = server.channels.filter(
        channel => channel.type === ChannelType.VIDEO
    );

    const members = server.members.filter(
        member => member.profileId !== profile.id
    );

    const role = server.members.find(
        member => member.profileId === profile.id
    )?.role;

    return (
        <div className="flex flex-col h-full w-full dark:bg-[#2B2D31] bg-[#e3e3e6]">
            <ServerHeader server={server} role={role} />
        </div>
    );
};

export default ServerSidebar;
