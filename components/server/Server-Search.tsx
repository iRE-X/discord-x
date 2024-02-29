"use client";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
    data: {
        label: string;
        type: "channel" | "member";
        data:
            | {
                  id: string;
                  name: string;
                  icon: React.ReactNode;
              }[]
            | undefined;
    }[];
}

const ServerSearch = ({ data }: Props) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { serverId } = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                setOpen(open => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const onClick = (id: string, type: "member" | "channel") => {
        setOpen(false);

        if (type === "channel")
            router.push(`/servers/${serverId}/channels/${id}`);

        if (type === "member")
            router.push(`/servers/${serverId}/conversations/${id}`);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    Search
                </p>
                <kbd className="inline-flex gap-1 rounded border pointer-events-none select-none h-5 px-1.5 bg-muted font-mono font-medium text-muted-foreground text-[10px] ml-auto">
                    <span className="text-xs">Ctrl</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search Channels and Members on the Server" />
                <CommandList>
                    <CommandEmpty>No Results Found!</CommandEmpty>
                    {data?.map(({ label, type, data }) => {
                        if (!data?.length) return null;

                        return (
                            <CommandGroup key={label} heading={label}>
                                {data.map(({ id, name, icon }) => (
                                    <CommandItem
                                        onSelect={() => onClick(id, type)}
                                        key={id}
                                    >
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        );
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
};

export default ServerSearch;
