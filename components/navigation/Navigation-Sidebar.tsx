import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import currentProfile from "@/lib/current-profile";
import prisma from "@/prisma/db";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import NavigationAction from "./Navigation-Action";
import NavigationItem from "./Navigation-Item";

const NavigationSidebar = async () => {
    const profile = await currentProfile();
    if (!profile) redirect("/");

    const servers = await prisma.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    return (
        <div className="h-full w-full flex flex-col space-y-6 text-primary items-center bg-[#e1e1e1] dark:bg-[#1E1F22] py-4">
            <NavigationAction />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10
                mx-auto"
            />
            <ScrollArea className="flex-1 w-full">
                {servers.map(server => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: { avatarBox: "h-[48px] w-[48px]" },
                    }}
                />
            </div>
        </div>
    );
};

export default NavigationSidebar;
