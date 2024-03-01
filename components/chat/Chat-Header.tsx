import { Hash, Menu } from "lucide-react";
import React from "react";
import MobileToggle from "../mobile-toggle";

interface Props {
    name: string;
    serverId: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}

const ChatHeader = ({ name, serverId, type, imageUrl }: Props) => {
    return (
        <div className="flex items-center px-3 font-semibold rounded border-neutral-200 dark:border-neutral-800 h-12 border-b-2">
            <MobileToggle serverId={serverId} />
            {type === "channel" && (
                <Hash className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}
            <p className="font-semibold text-base text-black dark:text-white">
                {name}
            </p>
        </div>
    );
};

export default ChatHeader;
