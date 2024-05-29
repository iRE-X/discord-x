import prisma from "@/prisma/db";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/current-user";
import { LOGIN_URL } from "@/routes";

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) return redirect(LOGIN_URL);

    const profile = await prisma.profile.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (profile) return profile;

    const newProfile = await prisma.profile.create({
        data: {
            userId: user.id!,
            name: user.name!,
            email: user.email!,
            imageUrl: user.image || "/user.png",
        },
    });

    return newProfile;
};
