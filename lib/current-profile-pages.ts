import prisma from "@/prisma/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = await getAuth(req);

    if (!userId) return null;

    const profile = await prisma.profile.findUnique({
        where: {
            userId,
        },
    });

    return profile;
};

export default currentProfilePages;
