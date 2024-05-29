import { auth } from "@/auth";
import prisma from "@/prisma/db";
import { NextApiRequest } from "next";

const currentProfilePages = async (req: NextApiRequest) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return null;

    const profile = await prisma.profile.findUnique({
        where: {
            userId,
        },
    });

    return profile;
};

export default currentProfilePages;
