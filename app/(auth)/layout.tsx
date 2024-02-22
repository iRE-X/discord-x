import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return <div className="bg-green-200 h-screen">{children}</div>;
};

export default AuthLayout;
