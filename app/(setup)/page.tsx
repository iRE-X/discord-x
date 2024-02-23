import { initialProfile } from "@/lib/initial-profile";
import prisma from "@/prisma/db";
import { redirect } from "next/navigation";

const SetUpPage = async () => {
    const profile = await initialProfile();

    const server = await prisma.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (server) return redirect(`/servers/${server.id}`);

    return <div>Create a Server</div>;
};

export default SetUpPage;
