"use client";

import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
    children: React.ReactNode;
    label: string;
    side: "left" | "right" | "top" | "bottom";
    align: "start" | "center" | "end";
}

const ActionToolTip = ({ children, label, side, align }: Props) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    align={align}
                    side={side}
                    className="bg-primary text-secondary"
                >
                    <p className="text-sm capitalize">{label.toLowerCase()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ActionToolTip;
