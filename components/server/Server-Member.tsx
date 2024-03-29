"use client";

import { cn } from "@/lib/utils";
import { Member, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../User-Avatar";

interface Props {
    member: Member & { profile: Profile };
    server: Server;
}

const iconMap = {
    GUEST: User,
    MODERATOR: ShieldCheck,
    ADMIN: ShieldAlert,
};

const ServerMember = ({ member }: Props) => {
    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[member.role];

    const handleClick = () => {
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "group flex items-center px-2 py-2 rounded-md w-full gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.memberId === member.id &&
                    "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar
                src={member.profile.imageUrl}
                className="h-8 w-8 md:h-8 md:w-8 mr-2"
            />
            <p
                className={cn(
                    "font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
                    params?.memberId === member.id &&
                        "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {member.profile.name}
            </p>
            <Icon
                className={cn(
                    "flex-shrink-0 h-4 w-4 text-zinc-500",
                    member.role === "MODERATOR" && "text-indigo-500",
                    member.role === "ADMIN" && "text-rose-500"
                )}
            />
        </button>
    );
};

export default ServerMember;
