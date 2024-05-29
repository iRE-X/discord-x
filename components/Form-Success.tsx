import { CheckCircle } from "lucide-react";
import React from "react";

interface Props {
  message: string;
}

const FormSuccess = ({ message }: Props) => {
  return (
    <div className="flex items-center gap-x-3 justify-center bg-green-400/25 rounded-lg text-sm text-emerald-700 p-2">
      <CheckCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
