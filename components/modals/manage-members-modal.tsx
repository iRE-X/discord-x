"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import useModal from "@/hooks/useModalStore";
import { ServerWithMembersWithProfile } from "@/types";
import UserAvatar from "@/components/User-Avatar";
import {
    Check,
    Gavel,
    Loader2,
    MoreVertical,
    Option,
    Shield,
    ShieldAlert,
    ShieldCheck,
    UserX,
} from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
    ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
    MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
    GUEST: null,
};

const ManageMembersModal = () => {
    const router = useRouter();
    const { onOpen, isOpen, type, onClose, data } = useModal();
    const [loadingId, setLoadingId] = useState("");

    const openDialog = isOpen && type === "manageMembers";

    let { server } = data as { server: ServerWithMembersWithProfile };

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server.id,
                },
            });
            // const url = `/api/members/${memberId}?serverId=${server.id}`;

            const { data } = await axios.patch(url, { role });
            router.refresh();
            onOpen("manageMembers", { server: data });
        } catch (error) {
            console.log("MANAGE-MEMBERS-ROLE-CHANGE ERROR: ", error);
        } finally {
            setLoadingId("");
        }
    };

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server.id,
                },
            });

            const { data } = await axios.delete(url);
            router.refresh();
            onOpen("manageMembers", { server: data });
        } catch (error) {
            console.log("MANAGE-MEMBERS-KICK ERROR: ", error);
        } finally {
            setLoadingId("");
        }
    };

    return (
        <Dialog open={openDialog} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription>
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map(member => (
                        <div
                            key={member.id}
                            className="flex items-center gap-x-2 mb-6"
                        >
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="flex gap-x-1 item-center text-xs font-semibold ">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-sinc-500/70">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId &&
                                loadingId !== member.profileId && (
                                    <div className="ml-auto">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                {loadingId !== member.id && (
                                                    <MoreVertical className="h-4 w-4" />
                                                )}
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="left">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <DropdownMenuItem>
                                                            <span>Role</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onRoleChange(
                                                                    member.id,
                                                                    "GUEST"
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            <span>GUEST</span>
                                                            {member.role ===
                                                                "GUEST" && (
                                                                <Check className="h-4 w-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onRoleChange(
                                                                    member.id,
                                                                    "MODERATOR"
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
                                                            <span>
                                                                MODERATOR
                                                            </span>
                                                            {member.role ===
                                                                "MODERATOR" && (
                                                                <Check className="h-4 w-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onKick(member.id)
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    <UserX className="h-4 w-4 mr-2" />
                                                    <span>Kick</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            {loadingId === member.id && (
                                <Loader2 className="h-4 w-4 ml-auto animate-spin" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ManageMembersModal;
