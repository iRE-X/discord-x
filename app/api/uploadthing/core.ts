import { currentUser } from "@/lib/current-user";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) throw new Error("Unauthorized");
    return { userId };
};

export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(handleAuth)
        .onUploadComplete(async () => {}),

    messageFile: f(["image", "pdf"])
        .middleware(handleAuth)
        .onUploadComplete(async () => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
