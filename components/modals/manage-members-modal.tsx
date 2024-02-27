"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import useModal from "@/hooks/useModal";
import { ServerWithMembersWithProfile } from "@/types";
import UserAvatar from "@/components/User-Avatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";

const roleIconMap = {
    ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
    MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
    GUEST: null,
};

const ManageMembersModal = () => {
    const { isOpen, type, onClose, data } = useModal();
    const [loadingId, setLoadingId] = useState("");

    const { server } = data as { server: ServerWithMembersWithProfile };

    const openDialog = isOpen && type === "manageMembers";

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
                                <p className="text-xs text-sinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId &&
                                loadingId !== member.profileId && (
                                    <div className="ml-auto">Action</div>
                                )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ManageMembersModal;
