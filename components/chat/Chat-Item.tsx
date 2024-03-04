import ActionToolTip from "@/components/Action-Tooltip";
import UserAvatar from "@/components/User-Avatar";
import { cn } from "@/lib/utils";
import { Member, Profile } from "@prisma/client";
import {
    Edit,
    File,
    ShieldAlert,
    ShieldCheck,
    Trash,
    User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import qs from "query-string";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import useModal from "@/hooks/useModalStore";

interface Props {
    id: string;
    content: string;
    fileUrl: string | null;
    member: Member & { profile: Profile };
    currentMember: Member;
    deleted: boolean;
    timeStamp: string;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, any>;
}

const roleIconMap = {
    GUEST: <User className="w-4 h-4 ml-2" />,
    MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
    content: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

const ChatItem = ({
    content,
    id,
    fileUrl,
    member,
    currentMember,
    deleted,
    timeStamp,
    isUpdated,
    socketQuery,
    socketUrl,
}: Props) => {
    const [isEditing, setEditing] = useState(false);
    const { onOpen } = useModal();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { content },
    });

    useEffect(() => {
        form.setValue("content", content);
    }, [content]);

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setEditing(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const isSubmiting = form.formState.isSubmitting;

    const fileType = fileUrl?.split(".").pop();

    const isAdmin = currentMember.role === "ADMIN";
    const isModerator = currentMember.role === "MODERATOR";
    const isOwner = currentMember.id === member.id;
    const canDelete = !deleted && (isAdmin || isModerator || isOwner);
    const canEdit = !deleted && isOwner && !fileUrl;

    const isPdf = fileUrl && fileType === "pdf";
    const isImage = fileUrl && fileType !== "pdf";

    const onEdit = async (values: FormData) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });

            await axios.patch(url, values);
        } catch (error) {
            console.log("EDIT-CHAT-ITEM ERROR: ", error);
        } finally {
            form.reset();
            setEditing(false);
        }
    };

    return (
        <div className="relative group flex items-center p-4 hover:bg-black/5 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionToolTip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionToolTip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timeStamp}
                        </span>
                    </div>
                    {isImage && (
                        <Link
                            href={fileUrl}
                            target="_blank"
                            className="relative mt-2 border w-64 h-48 bg-secondary overflow-hidden rounded-md flex items-center"
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-contain"
                                sizes="50%"
                            />
                        </Link>
                    )}

                    {isPdf && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-secondary w-fit">
                            <Link
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 mx-2 text-sm flex flex-col items-center gap-y-1 hover:underline"
                            >
                                <File className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                                PDF File
                            </Link>
                        </div>
                    )}

                    {!fileUrl && !isEditing && (
                        <p
                            className={cn(
                                "text-sm text-zinc-600 dark:text-zinc-300",
                                deleted &&
                                    "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                            )}
                        >
                            {content}
                            {isUpdated && !deleted && (
                                <span className="mx-2 text-xs text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}

                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onEdit)}
                                className="flex items-center w-full gap-x-2 pt-2"
                            >
                                <FormField
                                    name="content"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isSubmiting}
                                                        className="focus-visible:ring-0 focus-visible:ring-offset-0 border-none border-0 bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-700 dark:text-zinc-200"
                                                        placeholder="Edited Message"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    disabled={isSubmiting}
                                    size="sm"
                                    variant="primary"
                                >
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] text-zinc-400 mt-1">
                                Press Esc to cancel, Enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDelete && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute -top-2 right-5 p-1 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEdit && (
                        <ActionToolTip label="Edit">
                            <Edit
                                onClick={() => setEditing(true)}
                                className="h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
                            />
                        </ActionToolTip>
                    )}
                    {canDelete && (
                        <ActionToolTip label="Delete">
                            <Trash
                                onClick={() =>
                                    onOpen("deleteMessage", {
                                        apiUrl: `${socketUrl}/${id}`,
                                        query: socketQuery,
                                    })
                                }
                                className="h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
                            />
                        </ActionToolTip>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatItem;
