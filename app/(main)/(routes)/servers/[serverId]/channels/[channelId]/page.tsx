import MediaRoom from "@/components/Media-Room";
import ChatHeader from "@/components/chat/Chat-Header";
import ChatInput from "@/components/chat/Chat-Input";
import ChatMessages from "@/components/chat/Chat-Messages";

import currentProfile from "@/lib/current-profile";
import prisma from "@/prisma/db";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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
        <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
            <ChatHeader
                name={channel.name}
                serverId={serverId}
                type="channel"
            />
            {channel.type === "TEXT" && (
                <>
                    <ChatMessages
                        name={channel.name}
                        type="channel"
                        member={member}
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{ channelId, serverId }}
                        paramKey="channelId"
                        paramValue={channelId}
                        chatId={channelId}
                    />
                    <ChatInput
                        apiUrl="/api/socket/messages"
                        type="channel"
                        name={channel.name}
                        query={{ channelId, serverId }}
                    />
                </>
            )}

            {channel.type === "AUDIO" && (
                <MediaRoom chatId={channel.id} video={false} audio />
            )}

            {channel.type === "VIDEO" && (
                <MediaRoom chatId={channel.id} video audio />
            )}
        </div>
    );
};

export default ChannelPage;
