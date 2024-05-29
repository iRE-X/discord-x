"use client";
import React from "react";
import Link from "next/link";

interface Props {
  children?: React.ReactNode;
}

const LogoutButton = ({ children }: Props) => {
  return (
    <Link
      href={"/api/auth/signout"}
      className="cursor-pointer flex items-center justify-center p-2"
    >
      {children}
    </Link>
  );
};

export default LogoutButton;
