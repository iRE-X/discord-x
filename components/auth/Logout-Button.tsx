"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { FORGOT_PASSWORD_URL, LOGIN_URL } from "@/routes";

interface Props {
  children?: React.ReactNode;
}

const LogoutButton = ({ children }: Props) => {
  return (
    <span
      onClick={() => signOut({ callbackUrl: LOGIN_URL })}
      className="cursor-pointer flex items-center justify-center p-2"
    >
      {children}
    </span>
  );
};

export default LogoutButton;
