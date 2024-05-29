import prisma from "@/prisma/db";
import { currentUser } from "@/lib/current-user";

const currentProfile = async () => {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) return null;

    const profile = await prisma.profile.findUnique({
        where: {
            userId,
        },
    });

    return profile;
};

export default currentProfile;
