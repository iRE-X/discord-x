import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import currentProfile from "@/lib/current-profile";

import prisma from "@/prisma/db";
import { ChannelType } from "@prisma/client";

import { Hash, Mic, ShieldAlert, ShieldCheck, User, Video } from "lucide-react";
import { redirect } from "next/navigation";

import ServerHeader from "./Server-Header";
import ServerSearch from "./Server-Search";
import ServerSection from "./Server-Section";
import ServerChannel from "./Server-Channel";
import ServerMember from "./Server-Member";
import { Server } from "https";

const iconMap = {
    TEXT: <Hash className="h-4 w-4 mr-2" />,
    AUDIO: <Mic className="h-4 w-4 mr-2" />,
    VIDEO: <Video className="h-4 w-4 mr-2" />,
};

const roleIconMap = {
    GUEST: <User className="h-4 w-4 mr-2" />,
    MODERATOR: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

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
        <div className="flex flex-col h-full w-full dark:bg-[#2B2D31] bg-[#ebebeb]">
            <ServerHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map(member => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-100 dark:bg-zinc-700 my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            label="Text Channels"
                            sectionType="channel"
                            role={role}
                            channelType="TEXT"
                        />
                        {textChannels.map(channel => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            />
                        ))}
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            label="Voice Channels"
                            sectionType="channel"
                            role={role}
                            channelType="AUDIO"
                        />
                        {audioChannels.map(channel => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            />
                        ))}
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            label="Video Channels"
                            sectionType="channel"
                            role={role}
                            channelType="VIDEO"
                        />
                        {videoChannels.map(channel => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            />
                        ))}
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            label="Members"
                            sectionType="member"
                            role={role}
                            server={server}
                        />
                        {members.map(member => (
                            <ServerMember
                                key={member.id}
                                member={member}
                                server={server}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default ServerSidebar;
