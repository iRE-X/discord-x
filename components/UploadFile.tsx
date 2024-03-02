import React from "react";
import Image from "next/image";
import { File, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface Props {
    onChange: (url?: string) => void;
    value: string;
    endPoint: "serverImage" | "messageFile";
}

const UploadFile = ({ onChange, value, endPoint }: Props) => {
    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf")
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

    if (value && fileType === "pdf")
        return (
            <div className="relative flex flex-col items-center p-2 mt-2 rounded-md bg-background/10">
                <File className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 mx-2 text-sm hover:underline"
                >
                    Click to View
                </a>
                <button
                    className="absolute -top-2 -right-2 rounded-full text-white bg-rose-500"
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
