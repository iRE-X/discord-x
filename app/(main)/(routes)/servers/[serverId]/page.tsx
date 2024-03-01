import currentProfile from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/prisma/db";

interface Props {
    params: {
        serverId: string;
    };
}

const ServerPage = async ({ params: { serverId } }: Props) => {
    const profile = await currentProfile();
    if (!profile) redirectToSignIn();

    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile?.id,
                },
            },
        },
        include: {
            channels: {
                where: {
                    name: "general",
                },
            },
        },
    });

    if (!server) return null;

    return redirect(`/servers/${serverId}/channels/${server.channels[0].id}`);
};

export default ServerPage;
