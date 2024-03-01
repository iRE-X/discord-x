import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import NavigationSidebar from "./navigation/Navigation-Sidebar";
import ServerSidebar from "./server/Server-Sidebar";

const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="md:hidden">
                    <Menu />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
    );
};

export default MobileToggle;
