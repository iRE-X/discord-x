"use client";

import { Member, Message, Profile } from "@prisma/client";
import React, { Fragment } from "react";
import ChatWelcome from "./Chat-Welcome";
import useChatQuery from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";

type MessageWithMemberWithProfile = Message & {
    member: Member & { profile: Profile };
};

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

const ChatMessages = ({
    name,
    type,
    paramKey,
    paramValue,
    apiUrl,
    chatId,
}: Props) => {
    const queryKey = `chat:${chatId}`;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({ apiUrl, paramKey, paramValue, queryKey });

    if (status !== "success") {
        return (
            <div className="flex flex-col flex-1 items-center justify-center gap-y-2">
                {status === "loading" ? (
                    <Loader2 className="h-7 w-7 animate-spin text-zinc-500 dark:text-zinc-400" />
                ) : (
                    <ServerCrash className="h-7 w-7 text-zinc-500 dark:text-zinc-400" />
                )}
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {status === "loading"
                        ? "Loading Messages..."
                        : "Something Went Wrong"}
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <div className="flex-1" />
            <ChatWelcome name={name} type={type} />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((page, i) => (
                    <Fragment key={i}>
                        {page.items.map((m: MessageWithMemberWithProfile) => (
                            <div key={m.id}>{m.content}</div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default ChatMessages;
