import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
    return (
        <div className="flex flex-col w-screen m-auto text-center max-w-xs">
            <h1>Hello! This is Discord-X</h1>
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
        </div>
    );
}
