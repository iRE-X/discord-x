import NavigationSidebar from "@/components/navigation/Navigation-Sidebar";
import ServerSidebar from "@/components/server/Server-Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="md:hidden dark:bg-zinc-700/75 bg-zinc-200/90 p-2 mr-2 fixed top-1 left-1 z-40">
                    <Menu />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0 z-50">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
    );
};

export default MobileToggle;
