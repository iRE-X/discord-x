import BackButton from "@/components/auth/Back-Button";
import Header from "@/components/auth/Header";
import Socials from "@/components/auth/Socials";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import React from "react";

interface Props {
    label: string;
    backButtonLabel: string;
    backButtonHref: string;
    children: React.ReactNode;
    showSocials?: boolean;
}

const CardWrapper = ({
    children,
    label,
    backButtonHref,
    backButtonLabel,
    showSocials,
}: Props) => {
    return (
        <Card className="w-[400px] shadow-md bg-white text-black">
            <CardHeader>
                <Header label={label} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocials && (
                <CardFooter>
                    <Socials />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
        </Card>
    );
};

export default CardWrapper;
