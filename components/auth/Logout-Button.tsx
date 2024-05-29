"use client";
import { signOut } from "next-auth/react";
import React from "react";

interface Props {
  children?: React.ReactNode;
}

const LogoutButton = ({ children }: Props) => {
  return (
    <span
      onClick={() => signOut({ callbackUrl: "/" })}
      className="cursor-pointer flex items-center justify-center p-2"
    >
      {children}
    </span>
  );
};

export default LogoutButton;
