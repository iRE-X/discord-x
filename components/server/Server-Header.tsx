"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useModal from "@/hooks/useModalStore";
import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import {
    ChevronDown,
    LogOut,
    PlusCircle,
    Settings,
    Trash2,
    UserPlus2,
    Users2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    server: ServerWithMembersWithProfile;
    role?: MemberRole;
}

const ServerHeader = ({ server, role }: Props) => {
    const { onOpen } = useModal();
    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isMounted) return null;

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button className="w-full h-12 font-semibold px-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/20 dark:hover:bg-zinc-700/60 transition">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-sm font-medium text-black dark:text-neutral-400 space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("invite", { server })}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 cursor-pointer"
                    >
                        Invite People
                        <UserPlus2 className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("createChannel")}
                        className="px-3 py-2 cursor-pointer"
                    >
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("manageMembers", { server })}
                        className="px-3 py-2 cursor-pointer"
                    >
                        Manage Members
                        <Users2 className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("editServer", { server })}
                        className="px-3 py-2 cursor-pointer"
                    >
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                {isModerator && <DropdownMenuSeparator />}

                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("deleteServer", { server })}
                        className="text-rose-500 px-3 py-2 cursor-pointer"
                    >
                        Delete Server
                        <Trash2 className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("leaveServer", { server })}
                        className="text-rose-500 px-3 py-2 cursor-pointer"
                    >
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ServerHeader;
