"use client";

import CreateChannelModal from "@/components/modals/create-channel-modal";
import CreateServerModal from "@/components/modals/create-server-modal";
import EditServerModal from "@/components/modals/edit-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import LeaveServerModal from "@/components/modals/leave-server-modal";
import DeleteServerModal from "@/components/modals/delete-server-modal";
import ManageMembersModal from "@/components/modals/manage-members-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <CreateChannelModal />
            <ManageMembersModal />
            <EditServerModal />
            <LeaveServerModal />
            <DeleteServerModal />
        </>
    );
};

export default ModalProvider;
