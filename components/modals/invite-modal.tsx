"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import useModal from "@/hooks/useModal";
import useOrigin from "@/hooks/useOrigin";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const InviteModal = () => {
    const {
        isOpen,
        onOpen,
        type,
        onClose,
        data: { server },
    } = useModal();
    const origin = useOrigin();

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const openDialog = isOpen && type === "invite";

    const [copied, setCopied] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try {
            setLoading(true);
            const { data } = await axios.patch(
                `/api/servers/${server?.id}/invite-code`
            );
            onOpen("invite", { server: data });
        } catch (error) {
            console.log("NEW INVITE-LINK ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={openDialog} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Invite Friends!
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 text-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={inviteUrl}
                            readOnly
                        />
                        <Button
                            size="icon"
                            onClick={onCopy}
                            disabled={isLoading}
                        >
                            {copied ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        variant="link"
                        className="text-xs text-sinc-500 mt-4"
                        onClick={onNew}
                        disabled={isLoading}
                    >
                        Generate a new link
                        <RefreshCw className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
