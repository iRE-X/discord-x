import React from "react";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const Socials = () => {
    return (
        <div className="flex w-full gap-x-2">
            <Button
                variant="outline"
                size="lg"
                className="w-full bg-white hover:bg-slate-100"
                onClick={() => signIn("google")}
            >
                <FcGoogle className="w-5 h-5" />
            </Button>
            <Button
                variant="outline"
                size="lg"
                className="w-full bg-white hover:bg-slate-100 hover:text-black"
                onClick={() => signIn("github")}
            >
                <FaGithub className="w-5 h-5" />
            </Button>
        </div>
    );
};

export default Socials;
