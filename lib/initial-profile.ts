import { currentUser } from "@clerk/nextjs";
import prisma from "@/prisma/db";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) return redirect("/sign-in");

    const profile = await prisma.profile.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (profile) return profile;

    const newProfile = await prisma.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl,
        },
    });

    return newProfile;
};
