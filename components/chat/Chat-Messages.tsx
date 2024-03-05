"use client";

import useChatQuery from "@/hooks/useChatQuery";
import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";
import { ElementRef, Fragment, useRef } from "react";
import ChatItem from "./Chat-Item";
import ChatWelcome from "./Chat-Welcome";
import useChatSocket from "@/hooks/useChatSocket";
import useChatScroll from "@/hooks/useChatScroll";

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

const DATE_FORMAT = "d MMM yyy, HH:mm";

const ChatMessages = ({
    name,
    type,
    paramKey,
    paramValue,
    apiUrl,
    chatId,
    socketQuery,
    socketUrl,
    member,
}: Props) => {
    const queryKey = `chat:${chatId}`;
    // const addKey = `chat:${chatId}:messages`;
    // const updateKey = `chat:${chatId}:messages:update`;

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({ apiUrl, paramKey, paramValue, queryKey });

    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,
    });
    // useChatSocket({ addKey, updateKey, queryKey });

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
        <div ref={chatRef} className="flex-1 flex flex-col overflow-auto">
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && <ChatWelcome name={name} type={type} />}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-500 my-4" />
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                            Load previous messages
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((page, i) => (
                    <Fragment key={i}>
                        {page.items.map((m: MessageWithMemberWithProfile) => (
                            <ChatItem
                                key={m.id}
                                id={m.id}
                                content={m.content}
                                deleted={m.deleted}
                                fileUrl={m.fileUrl}
                                member={m.member}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                                currentMember={member}
                                timeStamp={format(
                                    new Date(m.createdAt),
                                    DATE_FORMAT
                                )}
                                isUpdated={m.updatedAt !== m.createdAt}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default ChatMessages;
