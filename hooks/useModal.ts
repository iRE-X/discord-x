import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
    | "createServer"
    | "invite"
    | "editServer"
    | "manageMembers"
    | "createChannel";

interface ModalData {
    server?: Server;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

const useModal = create<ModalStore>(set => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type: ModalType, data = {}) => set({ type, isOpen: true, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));

export default useModal;
