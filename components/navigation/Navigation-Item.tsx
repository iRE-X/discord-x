"use client";

import React from "react";
import ActionToolTip from "../Action-Tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface Props {
    id: string;
    imageUrl: string;
    name: string;
}

const NavigationItem = ({ id, name, imageUrl }: Props) => {
    const router = useRouter();
    const params = useParams();

    const onClick = () => {
        router.push(`/servers/${id}`);
    };

    return (
        <ActionToolTip side="right" align="center" label={name}>
            <button
                onClick={onClick}
                className="group relative flex items-center"
            >
                <div
                    className={cn(
                        "aboslute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                        params?.serverId !== id && "group-hover:h-[20px]",
                        params?.serverId === id ? "h-[36px]" : "h-[8px]"
                    )}
                />
                <div
                    className={cn(
                        "relative group mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden group-hover:rounded-[16px]",
                        params?.serverId === id &&
                            "bg-primary/20 text-primary rounded-[16px]"
                    )}
                >
                    <Image fill src={imageUrl} alt="Server" />
                </div>
            </button>
        </ActionToolTip>
    );
};

export default NavigationItem;
