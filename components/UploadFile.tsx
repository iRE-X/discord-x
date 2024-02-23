import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface Props {
    onChange: (url?: string) => void;
    value: string;
    endPoint: "serverImage" | "messageFile";
}

const UploadFile = ({ onChange, value, endPoint }: Props) => {
    const fileType = value?.split(".").pop();

    if (value && fileType != "pdf")
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="serverImage"
                    className="rounded-full"
                    sizes="100%"
                />
                <button
                    className="absolute top-0 right-0 rounded-full text-white bg-rose-500"
                    onClick={() => onChange("")}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    return (
        <UploadDropzone
            endpoint={endPoint}
            onClientUploadComplete={res => {
                onChange(res[0].url);
            }}
            onUploadError={error => {
                console.log(error);
            }}
        />
    );
};

export default UploadFile;
