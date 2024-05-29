import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
    src?: string | undefined | null;
    className?: string;
}

const UserAvatar = ({ src, className }: Props) => {
    if (!src) return null;

    return (
        <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
            <AvatarImage src={src} />
        </Avatar>
    );
};

export default UserAvatar;
