import currentProfile from "@/lib/current-profile";
import prisma from "@/prisma/db";
import { LOGIN_URL } from "@/routes";
import { notFound, redirect } from "next/navigation";

interface Props {
    params: {
        inviteCode: string;
    };
}

const InvitePage = async ({ params: { inviteCode } }: Props) => {
    const profile = await currentProfile();

    if (!profile) return redirect(LOGIN_URL);
    if (!inviteCode) return redirect("/");

    const valid = await prisma.server.findUnique({
        where: {
            inviteCode,
        },
    });

    if (!valid) notFound();

    const existingServer = await prisma.server.findUnique({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (existingServer) return redirect(`/servers/${existingServer?.id}`);

    const server = await prisma.server.update({
        where: {
            inviteCode,
        },
        data: {
            members: {
                create: [{ profileId: profile.id }],
            },
        },
    });

    if (server) return redirect(`/servers/${server.id}`);

    return null;
};

export default InvitePage;
