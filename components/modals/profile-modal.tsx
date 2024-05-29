"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import Info from "@/components/auth/Info";
import useModal from "@/hooks/useModalStore";
import UserAvatar from "@/components/User-Avatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

const roleIconMap = {
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  GUEST: null,
};

const ProfileModal = () => {
  const { onOpen, isOpen, type, onClose, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const openDialog = isOpen && type === "profile";
  const { user } = data as { user: User };

  if (!user) return null;

  return (
    <Dialog open={openDialog} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden max-w-screen-lg w-full flex items-center justify-between">
        <DialogHeader className="flex items-center justify-center space-y-4 pt-8 px-6">
          <UserAvatar
            src={user.image || "/user.png"}
            className="w-16 h-16 md:h-24 md:w-24"
          />
          <DialogTitle className="text-2xl font-bold text-center">
            {user.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 m-8 max-h-[420px] pr-6">
          <div className="space-y-2">
            <Info label="User ID" value={user.id} />
            <Info label="Email ID" value={user.email!} />
            <Info
              label="Email Verified"
              value={user.emailVerified?.toLocaleString() || "False"}
            />
            <Info
              label="Account Created At"
              value={user.createdAt.toLocaleString()}
            />
            <Info
              label="Account Updated At"
              value={user.updatedAt.toLocaleString()}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
