import { Hash, User2 } from "lucide-react";

interface Props {
    name: string;
    type: "channel" | "conversation";
}

const iconMap = {
    channel: Hash,
    conversation: User2,
};

const ChatWelcome = ({ name, type }: Props) => {
    const Icon = iconMap[type];

    return (
        <div className="space-y-2 mb-4 px-4">
            <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
                <Icon className="h-12 w-12 text-white" />
            </div>

            <p className="text-xl md:text-3xl font-bold">
                {type === "channel" ? "Welcome to #" : ""}
                {name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === "channel"
                    ? `This is the start of the #${name} channel`
                    : `This is the start of your conversation with ${name}`}
            </p>
        </div>
    );
};

export default ChatWelcome;
