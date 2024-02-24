import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/db";

const currentProfile = async () => {
    const { userId } = await auth();

    if (!userId) return null;

    const profile = await prisma.profile.findUnique({
        where: {
            userId,
        },
    });

    return profile;
};

export default currentProfile;
