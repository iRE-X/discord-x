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

const DeleteServerModal = () => {
    const {
        isOpen,
        type,
        onClose,
        data: { server },
    } = useModal();

    const router = useRouter();

    const openDialog = isOpen && type === "deleteServer";

    const [isLoading, setLoading] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/servers/${server?.id}`);

            onClose();
            router.push("/");
            router.refresh();
        } catch (error) {
            console.log("DELETE-SERVER-ERROR: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={openDialog} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Delete Server ?
                    </DialogTitle>
                    <DialogDescription className="text-center text-sinc-500">
                        Are you sure want to{" "}
                        <span className="font-semibold text-rose-500">
                            Delete
                        </span>{" "}
                        this server ?
                        <br />
                        <span className="font-semibold text-indigo-500">
                            {server?.name}&nbsp;
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

export default DeleteServerModal;
