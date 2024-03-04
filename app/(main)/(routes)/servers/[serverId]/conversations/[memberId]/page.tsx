import ChatHeader from "@/components/chat/Chat-Header";
import { getOrCreateConversation } from "@/lib/conversation";
import currentProfile from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/prisma/db";
import React from "react";
import ChatInput from "@/components/chat/Chat-Input";
import ChatMessages from "@/components/chat/Chat-Messages";

interface Props {
    params: {
        memberId: string;
        serverId: string;
    };
}

const MemberPage = async ({ params: { memberId, serverId } }: Props) => {
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
            <div className="flex-1" />
            {/* <ChatMessages
                member={currentMember}
                name={otherMember.profile.name}
                type="conversation"
                apiUrl="/api/messages"
                socketUrl="/api/socket/messages"
                socketQuery={{
                    memberOneId: currentMember.id,
                    memberTwoId: otherMember.id,
                    serverId,
                }}
                paramKey="conversationId"
                paramValue={conversation.id}
                chatId={conversation.id}
            /> */}
            <ChatInput
                apiUrl="/api/socket/message"
                type="conversation"
                name={otherMember.profile.name}
                query={{
                    memberOneId: currentMember.id,
                    memberTwoId: otherMember.id,
                    serverId,
                }}
            />
        </div>
    );
};

export default MemberPage;
