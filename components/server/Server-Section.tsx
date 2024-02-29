"use client";

import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import ActionToolTip from "../Action-Tooltip";
import { Plus, Settings } from "lucide-react";
import useModal from "@/hooks/useModalStore";
import { ServerWithMembersWithProfile } from "@/types";

interface Props {
    label: string;
    sectionType: "member" | "channel";
    role?: MemberRole;
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfile;
}

const ServerSection = ({
    label,
    sectionType,
    role,
    server,
    channelType,
}: Props) => {
    const { onOpen } = useModal();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-sm font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channel" && (
                <ActionToolTip label="Create Channel" side="top">
                    <button
                        onClick={() => onOpen("createChannel", { channelType })}
                        className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                    >
                        <Plus className="h-4 w-4 ml-auto" />
                    </button>
                </ActionToolTip>
            )}

            {role === MemberRole.ADMIN && sectionType === "member" && (
                <ActionToolTip label="Manage Members" side="top">
                    <button
                        onClick={() => onOpen("manageMembers", { server })}
                        className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                    >
                        <Settings className="h-4 w-4 ml-auto" />
                    </button>
                </ActionToolTip>
            )}
        </div>
    );
};

export default ServerSection;
