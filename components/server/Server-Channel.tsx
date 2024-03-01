"use client";

import { cn } from "@/lib/utils";
import { Channel, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ActionToolTip from "../Action-Tooltip";
import useModal from "@/hooks/useModalStore";

interface Props {
    channel: Channel;
    role?: MemberRole;
    server: Server;
}

const iconMap = {
    TEXT: Hash,
    AUDIO: Mic,
    VIDEO: Video,
};

const ServerChannel = ({ channel, role, server }: Props) => {
    const [isMounted, setMounted] = useState(false);
    const { channelId } = useParams();
    const { onOpen } = useModal();

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!isMounted) return null;

    const Icon = iconMap[channel.type];

    return (
        <button
            className={cn(
                "group flex items-center px-2 py-2 rounded-md w-full gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <Icon className="flex-shrink-0 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            <p
                className={cn(
                    "line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
                    channelId === channel.id &&
                        "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {channel.name}
            </p>
            {channel.name !== "general" && role !== "GUEST" && (
                <div className="flex items-center ml-auto gap-x-2">
                    <ActionToolTip label="Edit" side="top">
                        <button>
                            <Edit className="hidden group-hover:block h-4 w-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                        </button>
                    </ActionToolTip>
                    <ActionToolTip label="Delete" side="top">
                        <button
                            onClick={() =>
                                onOpen("deleteChannel", { server, channel })
                            }
                        >
                            <Trash className="hidden group-hover:block h-4 w-4  text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                        </button>
                    </ActionToolTip>
                </div>
            )}

            {channel.name === "general" && (
                <Lock className="h-4 w-4 ml-auto text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
            )}
        </button>
    );
};

export default ServerChannel;
