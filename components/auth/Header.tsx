import React from "react";

interface Props {
    label: string;
}

const Header = ({ label }: Props) => {
    return (
        <div className="w-full flex flex-col text-center gap-y-2">
            <h1 className="text-3xl font-bold font-sans">Discord-X</h1>
            <p className="text-muted-foreground text-sm">{label}</p>
        </div>
    );
};

export default Header;
