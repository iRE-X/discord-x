import SocketIndicator from "@/components/Socket-Indicator";
import UserAvatar from "@/components/User-Avatar";
import MobileToggle from "@/components/mobile-toggle";
import { Hash } from "lucide-react";
import ChatVideoButton from "./Chat-Video-Button";

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
            {type === "conversation" && (
                <UserAvatar
                    src={imageUrl}
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                />
            )}
            <p className="font-semibold text-base text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                {type === "conversation" && <ChatVideoButton />}
                {/* <SocketIndicator /> */}
            </div>
        </div>
    );
};

export default ChatHeader;
