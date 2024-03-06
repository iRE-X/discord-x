import NavigationSidebar from "@/components/navigation/Navigation-Sidebar";
import ServerSidebar from "@/components/server/Server-Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight, Menu } from "lucide-react";

const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="md:hidden mr-2">
                    <ChevronRight className="absolute w-3 h-[25vh] bg-zinc-200 dark:bg-zinc-600 rounded-r-full" />
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
