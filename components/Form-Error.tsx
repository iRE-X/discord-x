import { XCircle } from "lucide-react";

interface Props {
    message: string;
}

const FormError = ({ message }: Props) => {
    return (
        <div className="flex items-center gap-x-3 justify-center bg-red-400/25 rounded-lg text-sm text-rose-700 p-2">
            <XCircle className="w-4 h-4" />
            <p>{message}</p>
        </div>
    );
};

export default FormError;
