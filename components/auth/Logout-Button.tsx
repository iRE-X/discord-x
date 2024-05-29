"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { LOGIN_URL } from "@/routes";
import useOrigin from "@/hooks/useOrigin";

interface Props {
  children?: React.ReactNode;
}

const LogoutButton = ({ children }: Props) => {
  const origin = useOrigin();
  const redirectUrl = new URL(LOGIN_URL, origin).toString();

  return (
    <span
      onClick={() =>
        signOut({
          callbackUrl: redirectUrl,
          redirect: true,
        })
      }
      className="cursor-pointer flex items-center justify-center p-2"
    >
      {children}
    </span>
  );
};

export default LogoutButton;
