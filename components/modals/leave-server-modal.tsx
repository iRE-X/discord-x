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
import { useState } from "react";

const LeaveServerModal = () => {
    const {
        isOpen,
        type,
        onClose,
        data: { server },
    } = useModal();

    const router = useRouter();

    const openDialog = isOpen && type === "leaveServer";

    const [isLoading, setLoading] = useState(false);

    const onLeave = async () => {
        try {
            setLoading(true);

            await axios.patch(`/api/servers/${server?.id}/leave`);

            onClose();
            router.push("/");
            router.refresh();
        } catch (error) {
            console.log("LEAVE-SERVER-ERROR: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={openDialog} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Are You Sure ?
                    </DialogTitle>
                    <DialogDescription className="text-center text-sinc-500">
                        Do you really want to leave{" "}
                        <span className="font-semibold text-indigo-500">
                            {server?.name}
                        </span>
                        ??
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-8 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            onClick={onClose}
                            disabled={isLoading}
                            variant="ghost"
                        >
                            Stay
                        </Button>
                        <Button
                            onClick={onLeave}
                            disabled={isLoading}
                            variant="destructive"
                        >
                            Leave
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveServerModal;
