import currentProfile from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import prisma from "@/prisma/db";
import React from "react";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/Chat-Header";

interface Props {
    params: {
        channelId: string;
        serverId: string;
    };
}

const ChannelPage = async ({ params: { channelId, serverId } }: Props) => {
    const profile = await currentProfile();
    if (!profile) redirectToSignIn();

    const channel = await prisma.channel.findUnique({
        where: {
            id: channelId,
        },
    });

    const member = await prisma.member.findFirst({
        where: {
            serverId,
            profileId: profile?.id,
        },
    });

    if (!channel || !member) return redirect("/");

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={serverId}
                type="channel"
            />
        </div>
    );
};

export default ChannelPage;
