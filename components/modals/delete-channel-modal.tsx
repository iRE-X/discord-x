"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useModalStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

const DeleteChannelModal = () => {
    const {
        isOpen,
        type,
        onClose,
        data: { server, channel },
    } = useModal();

    const router = useRouter();

    const openDialog = isOpen && type === "deleteChannel";

    const [isLoading, setLoading] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true);

            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            });

            await axios.delete(url);

            onClose();
            router.push(`/servers/${server?.id}`);
            router.refresh();
        } catch (error) {
            console.log("DELETE-CHANNEL-ERROR: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={openDialog} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Delete Channel ?
                    </DialogTitle>
                    <DialogDescription className="text-center text-sinc-500">
                        Are you sure want to{" "}
                        <span className="font-semibold text-rose-500">
                            Delete
                        </span>{" "}
                        this channel ?
                        <br />
                        <span className="font-semibold text-indigo-500">
                            #{channel?.name}&nbsp;
                        </span>
                        will be permanently deleted
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-8 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            onClick={onClose}
                            disabled={isLoading}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onDelete}
                            disabled={isLoading}
                            variant="destructive"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteChannelModal;
