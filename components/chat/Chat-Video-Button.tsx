"use client";

import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import React, { useEffect } from "react";
import ActionToolTip from "../Action-Tooltip";

const ChatVideoButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const isVideo = searchParams?.get("video");

    const toolTipLabel = isVideo ? "End Video Call" : "Start Video Call";
    const Icon = isVideo ? VideoOff : Video;

    const onClick = () => {
        const url = qs.stringifyUrl(
            {
                url: pathname || "",
                query: {
                    video: isVideo ? undefined : true,
                },
            },
            { skipNull: true }
        );

        router.push(url);
    };

    return (
        <ActionToolTip side="bottom" label={toolTipLabel}>
            <button onClick={onClick} className="hover:opacity-75 mr-4">
                <Icon className="w-7 h-7 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionToolTip>
    );
};

export default ChatVideoButton;
