import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
    href: string;
    label: string;
}

const BackButton = ({ href, label }: Props) => {
    return (
        <Button
            variant="link"
            size="sm"
            className="font-normal w-full text-blue-700"
        >
            <Link href={href}>{label}</Link>
        </Button>
    );
};

export default BackButton;
