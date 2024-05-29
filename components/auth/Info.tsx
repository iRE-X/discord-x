import React from "react";

const Info = ({ label, value }: { label: string; value?: string | null }) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border-b p-3">
      <p className="text-md font-normal ">{label}</p>-
      <p className="truncate max-w-[70%] font-mono p-2 text-sm bg-slate-200 rounded-md">
        {value}
      </p>
    </div>
  );
};
export default Info;
