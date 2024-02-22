import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex flex-col w-screen m-auto text-center max-w-xs">
            <h1>Hello! This is Discord-X</h1>
            <Button variant="destructive">Click Here</Button>
        </div>
    );
}
