import ChatHeader from "@/components/chat/Chat-Header";
import { getOrCreateConversation } from "@/lib/conversation";
import currentProfile from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/prisma/db";
import React from "react";
import ChatInput from "@/components/chat/Chat-Input";
import ChatMessages from "@/components/chat/Chat-Messages";
import MediaRoom from "@/components/Media-Room";

interface Props {
    params: {
        memberId: string;
        serverId: string;
    };
    searchParams: {
        video?: boolean;
    };
}

const MemberPage = async ({
    params: { memberId, serverId },
    searchParams: { video },
}: Props) => {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    const currentMember = await prisma.member.findFirst({
        where: {
            serverId,
            profileId: profile.id,
        },
        include: {
            profile: true,
        },
    });

    if (!currentMember) redirect("/");

    const conversation = await getOrCreateConversation(
        currentMember.id,
        memberId
    );

    if (!conversation) redirect(`/servers/${serverId}`);

    const { memberOne, memberTwo } = conversation;

    const otherMember =
        memberOne.profile.id === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
            <ChatHeader
                type="conversation"
                name={otherMember.profile.name}
                imageUrl={otherMember.profile.imageUrl}
                serverId={serverId}
            />
            {video && <MediaRoom chatId={conversation.id} video audio />}
            {!video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        socketUrl="/api/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        chatId={conversation.id}
                    />
                    <ChatInput
                        apiUrl="/api/direct-messages"
                        type="conversation"
                        name={otherMember.profile.name}
                        query={{
                            conversationId: conversation.id,
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default MemberPage;
