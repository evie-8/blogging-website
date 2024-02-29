"use server";

import { getToken, getUserByEmail } from "@/data/user";
import prismadb from "@/lib/prismadb";

export const newVerify = async (token: string) =>  {
    const existingToken = await getToken(token);

    if (!existingToken) {
        return { error: "Token does not exist!"}
    }

    const expired = new Date(existingToken.expires) < new Date();

    if (expired) {
        return {error: "Token has expired"}

      
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return {error: "Email does not exist"};
        }
        await prismadb.user.update({
            where: {id: existingUser.id},
            data: {
                emailVerified: new Date(),
                email: existingToken.email
            }
        });

        await prismadb.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })

        return {success: "Email verfied"};
    
    }
