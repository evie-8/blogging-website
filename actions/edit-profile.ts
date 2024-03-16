"use server";

import { auth } from "@/auth";
import { getUserById } from "@/data/user";
import prismadb from "@/lib/prismadb";
import { EditProfileSchema } from "@/schemas/schema";
import * as z  from "zod";


export const updateProfile = async(values: z.infer<typeof EditProfileSchema>) => {

    const session = await auth();
    console.log('session', session)
    if (!session || !session.user) {
        return {error: 'Please login to edit profile 🔒'}
    }

    const validateData = await EditProfileSchema.safeParseAsync(values);

    if (!validateData.success) {
       
        return {error: "Invalid data"}
    }


    //@ts-ignore
    const {username, email, name, image, isTwoFactorEnabled, bio, socials:{youtube, instagram, github, facebook, twitter, website} 
    } = validateData.data


    //@ts-ignore
    const findUser = await getUserById(session.user.id);
    if (findUser?.email !== email || !findUser) {
        return {error: 'User does not exist'}
    }


    await prismadb.user.update({
        where: {
            email
        },
        data: {
            name,
            username,
            image,
            isTwoFactorEnabled,
            bio,
            youTube: youtube,
            instagram,
            github,
            facebook,
            twitter,
            website
            
        }
    })


    return {success: 'Profile updated'}

}
