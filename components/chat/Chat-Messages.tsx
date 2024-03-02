import { Member } from "@prisma/client";
import React from "react";
import ChatWelcome from "./Chat-Welcome";

interface Props {
    type: "channel" | "conversation";
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, any>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}

const ChatMessages = ({ name, type }: Props) => {
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <div className="flex-1" />
            <ChatWelcome name={name} type={type} />
        </div>
    );
};

export default ChatMessages;
