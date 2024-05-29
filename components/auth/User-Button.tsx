"use client";

import UserAvatar from "@/components/User-Avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./Logout-Button";
import { LogOut } from "lucide-react";
import useModal from "@/hooks/useModalStore";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

const UserButton = ({ user }: { user: User | null }) => {
  const { onOpen } = useModal();
  if (!user) redirect("/");

  return (
    <div className="flex justify-center items-center p-2 text-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar src={user?.image || "/user.png"} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:bg-zinc-700 bg-zinc-100">
          <DropdownMenuItem>
            <button
              onClick={() => onOpen("profile", { user })}
              className="p-2 font-bold w-full border-b-2"
            >
              Profile
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton>
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </LogoutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
